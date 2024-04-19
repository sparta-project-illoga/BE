import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Area } from './entities/area.entity';
import { TourSpot } from './entities/tour-spot.entity';
import { Post } from 'src/post/entities/post.entity';
import { PuppeteerService } from 'src/utils/puppeteer.service';
import { TourSpotTag } from './entities/tour-spot-tag.entity';
import { Tag } from './entities/tag.entity';
import { Checkpoint } from './entities/check-point.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location,
      User,
      Area,
      TourSpot,
      Post,
      TourSpotTag,
      Tag,
      Checkpoint,
    ]),
    ConfigModule,
  ],
  controllers: [LocationController],
  providers: [LocationService, PuppeteerService],
  exports: [LocationService],
})
export class LocationModule {}
