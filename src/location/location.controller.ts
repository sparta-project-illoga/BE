import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // 유저 지역정보 저장
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateLocation(
    @Body() locationData: { latitude: 37.1234; longitude: 122.5678 },
    // @Body() locationData: { latitude: number; longitude: number },
    @UserInfo() user: User,
  ) {
    return this.locationService.updateLocation(user, locationData);
  }

  // 지역정보 저장
  @Put('area')
  async addArea() {
    await this.locationService.addArea();
  }

  //여행정보 저장
  @Put('tourSpot')
  async addTourSpot() {
    await this.locationService.addTourSpot();
  }

  @Get('tourSpot')
  async getAllTourSpot() {
    const tourSpots = await this.locationService.findAllTourSpot();
    return tourSpots;
  }
}
