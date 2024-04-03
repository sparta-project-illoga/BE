import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { ScheduleService } from 'src/schedule/schedule.service';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Place } from './entities/place.entity';

@Module({
  imports: [
    ScheduleModule,
    TypeOrmModule.forFeature([Plan, Schedule, Place])
  ],
  controllers: [PlanController],
  providers: [PlanService, ScheduleService],
})
export class PlanModule { }
