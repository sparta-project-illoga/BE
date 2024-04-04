import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateLocation(
    @Body() locationData: { latitude: 37.1234; longitude: 122.5678 },
    @UserInfo() user: User,
  ) {
    // const userId: number = 1;
    // const userId = user.id; // 임시로 하드코딩해서 userId를 넣어줌
    // const locationData = { latitude: 37.1234, longitude: 122.5678 };
    // console.log(user.id);
    return this.locationService.updateLocation(user, locationData);
  }
}
