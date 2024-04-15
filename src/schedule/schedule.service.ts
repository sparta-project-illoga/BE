import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { And, MoreThan, Repository } from 'typeorm';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Place } from 'src/plan/entities/place.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private ScheduleRepository: Repository<Schedule>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) { }

  // 스케쥴 생성
  async create(
    planId: number, 
    createScheduleDto: CreateScheduleDto,
    user: User
  ) {

    const checkUserPlan = await this.planRepository.findOne({
      where : {id : planId}
    });

    if(!checkUserPlan) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    if (checkUserPlan.userId !== user.id) {
      throw new BadRequestException('작성자만 등록할 수 있습니다.');
    }

    const lastschedule = await this.ScheduleRepository.createQueryBuilder("schedule")
      .where("schedule.planId = :planId", { planId })
      .orderBy("schedule.date", "DESC")
      .getOne();

    const { date, place, money } = createScheduleDto;

    const schedule = await this.ScheduleRepository.find({where : {planId}});

    // 일정 확인 (마지막 일정보다 같거나 +1 커야만 한다)
    if ( !lastschedule || (schedule.length === 0 && date === 1) ||lastschedule.date === date || lastschedule.date + 1 === date)  {
      // 스케줄 생성
      const createSchedule = await this.ScheduleRepository.save({
        date,
        place,
        money,
        planId: planId,
      });

      // 지역이 이미 존재하는지 확인
      const exitPlace = await this.placeRepository.findOne({
        where: { planId, placename: place }
      });

      // 존재하지 않으면 총지역에 추가한다
      if (!exitPlace) {
        await this.placeRepository.save({
          planId: planId,
          placename: place
        })
      }

      return { createSchedule };
    }
    else {
      return { BadRequestException, message: "일정을 잘못입력했습니다" }
    }
  }

  // 스케쥴 복사
  async pasteSchedule(planid: number, schedule: Schedule) {

    const createSchedule = await this.ScheduleRepository.save({
      planId: planid,
      place: schedule.place,
      date: schedule.date,
      money: schedule.money

    })

    return createSchedule;
  }

  // 총지역 조회
  async findAllPlace(planId: number): Promise<{ place: Place[]; }> {
    const place = await this.placeRepository.find({
      where: { planId }
    });

    return { place };
  }

  // 총지역 복사
  async pasteplace(planid: number, place: Place) {

    const createSchedule = await this.placeRepository.save({
      planId: planid,
      placename: place.placename
    })

    return createSchedule;
  }

  // 스케쥴 조회
  async findAll(planId: number): Promise<{ schedule: Schedule[]; }> {

    const schedule = await this.ScheduleRepository.find({
      where: { planId },
      order: { id: "ASC" }
    });

    return { schedule };

  }

  // 스케줄 수정
  async update(planId: number, id: number, updateScheduleDto: UpdateScheduleDto, user: User) {


    const checkUserPlan = await this.planRepository.findOne({
      where : {id : planId}
    });

    if(!checkUserPlan) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    if (checkUserPlan.userId !== user.id) {
      throw new BadRequestException('작성자만 등록할 수 있습니다.');
    }

    const { place, money } = updateScheduleDto;

    const findSchedule = await this.ScheduleRepository.findOne({
      where: { planId: planId, id: id }
    });

    if (!findSchedule) {
      throw new BadGatewayException("존재하지 않는 스케줄입니다");
    }

    const updateSchedule = await this.ScheduleRepository.update(
      { id },
      {
        place,
        money
      }
    );

    return updateSchedule;
  }

  // 스케쥴 삭제
  async remove(planId: number, id: number, user: User) {

    const checkUserPlan = await this.planRepository.findOne({
      where : {id : planId}
    });

    if(!checkUserPlan) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    if (checkUserPlan.userId !== user.id) {
      throw new BadRequestException('작성자만 등록할 수 있습니다.');
    }

    // 삭제할 스케쥴 찾기
    const deleteSchedule = await this.ScheduleRepository.findOne({
      where: { id }
    })

    if (!deleteSchedule) {
      throw new BadGatewayException("존재하지 않는 스케줄입니다");
    }

    // 삭제할 지역 찾기
    const findPlan = await this.ScheduleRepository.count({
      where: { planId, place: deleteSchedule.place }
    });

    // 삭제할 지역의 개수가 1개면 총지역에서 삭제한다
    if (findPlan === 1) {
      await this.placeRepository.delete({
        planId,
        placename: deleteSchedule.place
      });
    }

    const sameDateSchedule = await this.ScheduleRepository.find({
      where : {
        planId,
        date: deleteSchedule.date
      }
    })

    const findAllSchedule = await this.ScheduleRepository.find({
      where : {
        planId,
        date : MoreThan(deleteSchedule.date)
      }
    });

    if (sameDateSchedule.length === 1) {
      for (const schedule of findAllSchedule) {
        schedule.date = schedule.date - 1;
        await this.ScheduleRepository.save(schedule);
      }
    }

    // 플랜의 총 예산
    const findtotaldata = await this.planRepository.findOne({
      where: { id: planId }
    })

    // 플랜의 마지막 스케쥴
    const lastschedule = await this.ScheduleRepository.createQueryBuilder("schedule")
      .where("schedule.planId = :planId", { planId })
      .orderBy("schedule.date", "DESC")
      .getOne();

    // 플랜에서 총예산 - 삭제하는 스케쥴 예산, 총여행기간 수정
    await this.planRepository.update(
      { id: planId },
      {
        totalmoney: findtotaldata.totalmoney - deleteSchedule.money,
        totaldate: lastschedule.date
      });

    // 스케줄 삭제
    await this.ScheduleRepository.delete(id);

    return deleteSchedule;
  }

  // 플랜관련 삭제 
  async removeByplanId(planId: number) {

    await this.ScheduleRepository.delete({ planId });
  }

  // 플랜의 마지막 스켸줄
  async lastScehdule(planId: number) {

    return await this.ScheduleRepository.createQueryBuilder("schedule")
      .where("schedule.planId = :planId", { planId })
      .orderBy("schedule.date", "DESC")
      .getOne();
  }

}
