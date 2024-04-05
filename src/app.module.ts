import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { TravelModule } from './travel/travel.module';
import { PostCommentModule } from './post-comment/post-comment.module';
import { LocationModule } from './location/location.module';
import { PostModule } from './post/post.module';
import { ScheduleModule } from './schedule/schedule.module';

import { User } from './user/entities/user.entity';
import { Travel } from './travel/entities/travel.entity';
import { Plan } from './plan/entities/plan.entity';
import { Category } from './category/entities/category.entity';
import { Location } from './location/entities/location.entity';
import { PostComment } from './post-comment/entities/post-comment.entity';
import { Post } from './post/entities/post.entity';
import { Schedule } from './schedule/entities/schedule.entity';
import { Place } from './plan/entities/place.entity';
import { MemberModule } from './member/member.module';
import { Member } from './member/entities/member.entity';
import { Area } from './location/entities/area.entity';
import { TourSpot } from './location/entities/tour-spot.entity';
import { CategoryModule } from './category/category.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
      User,
      Travel,
      Plan,
      Schedule,
      Place,
      Post,
      PostComment,
      Location,
      Member,
      Category,
      Area,
      TourSpot,
    ], // 엔티티는 반드시 여기에 명시!
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    PostModule,
    PostCommentModule,
    LocationModule,
    PlanModule,
    TravelModule,
    ScheduleModule,
    ScheduleModule,
    MemberModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
