import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { ScheduleService } from 'src/schedule/schedule.service';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Place } from './entities/place.entity';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { Member } from 'src/member/entities/member.entity';
import { MemberService } from 'src/member/member.service';
import { User } from 'src/user/entities/user.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { AwsModule } from 'src/aws/aws.module';
import { RedisService } from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';
import { UtilsService } from 'src/utils/utils.service';
import { EventsModule } from 'src/events/events.module';
import { Area } from 'src/location/entities/area.entity';
import { Favorite } from './entities/favorite.entity';
import { PlanComment } from 'src/plan-comment/entities/plan-comment.entity';

@Module({
  imports: [
    ScheduleModule,
    UtilsModule,
    AwsModule,
    RedisModule,
    //이거 잘못되면 삭제해야함
    EventsModule,
    TypeOrmModule.forFeature([
      Plan,
      Schedule,
      Place,
      Category,
      Member,
      User,
      Area,
      Favorite,
      PlanComment,
    ]),
  ],
  controllers: [PlanController],
  providers: [
    PlanService,
    ScheduleService,
    CategoryService,
    MemberService,
    RedisService,
    UtilsService,
  ],
  exports: [PlanService],
})
export class PlanModule { }
