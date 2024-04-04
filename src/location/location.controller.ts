import { Body, Controller, Put } from '@nestjs/common';
import { LocationService } from './location.service';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Put()
  async updateLocation(
    @Body() locationData: { latitude: number; longitude: number },
    @UserInfo() user: User,
  ) {
    // const userId: number = 1;
    // const user = userId; // 임시로 하드코딩해서 userid를 넣어줌
    return this.locationService.updateLocation(user, locationData);
  }
}
