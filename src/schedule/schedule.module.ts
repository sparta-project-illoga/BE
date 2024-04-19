import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Place } from 'src/plan/entities/place.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Area } from 'src/location/entities/area.entity';
import { TourSpot } from 'src/location/entities/tour-spot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Place, Plan, TourSpot])],
  providers: [ScheduleService],
  controllers: [ScheduleController],
  exports: [ScheduleService, TypeOrmModule],
})
export class ScheduleModule {}
