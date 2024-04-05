import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Area } from './entities/area.entity';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateLocation(
    @Body() locationData: { latitude: 37.1234; longitude: 122.5678 },
    // @Body() locationData: { latitude: number; longitude: number },
    @UserInfo() user: User,
  ) {
    return this.locationService.updateLocation(user, locationData);
  }

  @Put('area')
  async addArea() {
    await this.locationService.addArea();
  }
}
