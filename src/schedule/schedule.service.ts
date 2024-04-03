import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Repository } from 'typeorm';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Place } from 'src/plan/entities/place.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private ScheduleRepository: Repository<Schedule>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
  ) { }

  async create(planId: number, createScheduleDto: CreateScheduleDto) {

    const { place, money } = createScheduleDto;

    const count = await this.ScheduleRepository.count({
      where: { planId: planId },
    });

    // 스케줄 생성
    const createSchedule = await this.ScheduleRepository.save({
      date: count + 1,
      place,
      money,
      planId: planId,
    });

    // 지역 이름이 이미 존재하는지 확인
    const exitPlace = await this.placeRepository.findOne({
      where: { planId, placename: place }
    });

    // 존재하지 않으면 지역에 추가한다
    if (!exitPlace) {
      await this.placeRepository.save({
        planId: planId,
        placename: place
      })
    }

    return { createSchedule };
  }

  async findAll(planId: number): Promise<{ schedule: Schedule[]; }> {
    const schedule = await this.ScheduleRepository.find({
      where: { planId },
      order: { id: "ASC" }
    });

    return { schedule };

  }

  async update(planId: number, id: number, updateScheduleDto: UpdateScheduleDto) {
    const findSchedule = await this.ScheduleRepository.findOne({
      where: { planId: planId, id: id }
    });

    if (!findSchedule) {
      throw new BadGatewayException("존재하지 않는 스케줄입니다");
    }

    const updateSchedule = await this.ScheduleRepository.update(
      { id },
      updateScheduleDto
    );

    return updateSchedule;
  }

  async remove(planId: number, id: number) {

    const deleteSchedule = await this.ScheduleRepository.findOne({
      where: { id }
    })

    const findPlan = await this.ScheduleRepository.count({
      where : {planId, place: deleteSchedule.place}
    });

    if (findPlan === 1) {
      await this.placeRepository.delete({
        planId,
        placename: deleteSchedule.place
      });
    }

    await this.ScheduleRepository.delete(id);

    return deleteSchedule;
  }

  async removeByplanId(planId: number) {

    await this.ScheduleRepository.delete({ planId });
  }

}
