import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Area } from './entities/area.entity';
import { TourSpot } from './entities/tour-spot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, User, Area, TourSpot]),
    ConfigModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
