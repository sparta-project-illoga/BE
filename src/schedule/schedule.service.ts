import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(Schedule)
        private readonly ScheduleRepository: Repository<Schedule>
      ) {}
      
      async create(planId:number ,createScheduleDto: CreateScheduleDto) {
        const {place, money} = createScheduleDto;

        const count = await this.ScheduleRepository.count({
            where: {planId: planId},
        });
    
        const createSchedule = await this.ScheduleRepository.save({
            date : count + 1,
            ...CreateScheduleDto,
            planId,
        });

        return {createSchedule};
      }
    
      findAll() {
        return `This action returns all plan`;
      }
    
      findOne(id: number) {
        return `This action returns a #${id} plan`;
      }
    
      update(id: number) {
        return `This action updates a #${id} plan`;
      }
    
      remove(id: number) {
        return `This action removes a #${id} plan`;
      }
}
