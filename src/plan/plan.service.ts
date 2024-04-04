import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PickPlanDto } from './dto/pick-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ReturnDocument } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { ScheduleService } from '../schedule/schedule.service';
import { Place } from './entities/place.entity';

@Injectable()
export class PlanService {

  constructor(
    @InjectRepository(Plan) 
    private planRepository: Repository<Plan>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    private scheduleService: ScheduleService
  ) { }

  // 1. 플랜 생성 (단 총 예산과 일정은 추가가 안됨)
  async create(createPlanDto: CreatePlanDto) {
    const { name, image } = createPlanDto;

    if (!name) {
      return new BadRequestException("이름을 입력하세요.");
    }

    const createPlan = await this.planRepository.save({
      name,
      image
    });

    return { createPlan };
  }

  // 스케줄 가져와서 생성
  async createpassive(id: number ,pickPlanDto: PickPlanDto) {
    const {pickplan} = pickPlanDto;

    const findSchedule = await this.scheduleService.findAll(pickplan);

    for (const schedule of findSchedule.schedule) {
      await this.scheduleService.pasteSchedule(id,schedule);
    }

    const findPlace = await this.scheduleService.findAllPlace(pickplan);

    for (const place of findPlace.place) {
      await this.scheduleService.pasteplace(id, place);
    }

    const totalschedule = await this.scheduleService.findAll(id);

    const totaldate = totalschedule.schedule.length;

    const totalmoney = totalschedule.schedule.reduce((total, schedule) => total + schedule.money, 0);

    await this.planRepository.update(
      {id},
      {
        totaldate,
        totalmoney
      }
    );

    return totalschedule;

  }

  // 2. 플랜 총 일정 및 에산 추가
  async update(id: number, createPlanDto: CreatePlanDto) {

    const {name} = createPlanDto;

    const totalschedule = await this.scheduleService.findAll(id);

    const totaldate = totalschedule.schedule.length;

    const totalmoney = totalschedule.schedule.reduce((total, schedule) => total + schedule.money, 0);

    await this.planRepository.update(
      { id },
      {
        name,
        totaldate,
        totalmoney,
      });

      return totalschedule;

  }

  async findAll() {
    const plan = await this.planRepository.find();

    if (!plan || plan.length === 0) {
      throw new NotFoundException("플랜이 없습니다")
    }

    return plan
  }

  // 플랜 상세 조회 (여기서 총 지역,예산,일정 및 스케줄 조회)
  async findOne(id: number) {
    const findOnePlan = await this.planRepository.findOne({
      where: { id },
    });

    if (!findOnePlan) {
      throw new NotFoundException("플랜이 없습니다.");
    }

    const findSchedule = await this.scheduleService.findAll(id);

    const findPlace = await this.placeRepository.find({where: {planId : id}});

    return { findOnePlan,findPlace, findSchedule };
  }

  // 플랜 삭제(동일 지역이 있을 경우 총 지역에 삭제 x)
  async remove(id: number) {
    const findPlan = await this.planRepository.findOne({
      where: { id }
    })

    const findAllSchedule = await this.scheduleService.findAll(id)

    await this.planRepository.delete({ id });
    
    await this.scheduleService.removeByplanId(id);

    return { findPlan, findAllSchedule };
  }
}
