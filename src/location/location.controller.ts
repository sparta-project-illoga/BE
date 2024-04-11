import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
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

  //여행정보 전체조회
  @Get('tourSpot')
  async getAllTourSpot() {
    const tourSpots = await this.locationService.findAllTourSpot();
    return tourSpots;
  }

  //여행정보 검색기능
  @Get('tourSpot/search')
  async searchTourSpot(@Query('areaCode') areaCode: string) {
    return this.locationService.searchTourSpot(areaCode);
  }

  //여행정보 검색
  @Get('search')
  async search(@Query('keyword') keyword: string) {
    const tourSpots =
      await this.locationService.searchTourSpotByKeyword(keyword);
    return tourSpots;
  }

  //여행정보 태그 저장
  @Get('tag')
  async searchTourSpotByPuppeteer() {
    try {
      const scrapedData =
        await this.locationService.searchTourSpotByPuppeteer();
      return scrapedData;
    } catch (error) {
      return { error: error.message };
    }
  }
}
