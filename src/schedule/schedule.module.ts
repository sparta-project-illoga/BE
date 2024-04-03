import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Place } from 'src/plan/entities/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Place])],
  providers: [ScheduleService],
  controllers: [ScheduleController],
  exports: [ScheduleService, TypeOrmModule],
})
export class ScheduleModule {}
