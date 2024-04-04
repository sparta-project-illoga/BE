import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
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

  async update(id: number, updatePlanDto: UpdatePlanDto) {

    const {name} = updatePlanDto;

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

    return plan
  }

  async findOne(id: number) {
    const findOnePlan = await this.planRepository.findOne({
      where: { id },
    });

    const findSchedule = await this.scheduleService.findAll(id);

    const findPlace = await this.placeRepository.find({where: {planId : id}});

    return { findOnePlan,findPlace, findSchedule };
  }

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
