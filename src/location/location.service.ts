import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly configService: ConfigService,
  ) {}
  // 사용자 위치 정보 업데이트
  async updateLocation(
    // userId: number,
    userID: User, // user연결되면 이걸로 쓰기
    locationData: { latitude: number; longitude: number },
  ) {
    const { latitude, longitude } = locationData;
    console.log('사용자 위치데이터 : ', latitude, longitude);

    try {
      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
        {
          headers: {
            Authorization: `KakaoAK ${this.configService.get('KAKAO_API_KEY')}`,
          },
        },
      );

      const { address, road_address } = response.data.documents[0];
      console.log('message:', response.data.documents[0]);

      const userLocation = await this.locationRepository.findOne({
        where: { user: { id: userId } },
      });
      if (!userLocation) {
        return { message: '사용자 위치정보를 찾을수 없습니다.' };
      }
      const addressInfo = address || road_address;

      userLocation.latitude = latitude;
      userLocation.longitude = longitude;
      userLocation.address = addressInfo.address_name;
      userLocation.region_1depth_name = addressInfo.region_1depth_name;
      userLocation.region_2depth_name = addressInfo.region_2depth_name;
      userLocation.region_3depth_name = addressInfo.region_3depth_name;

      await this.locationRepository.save(userLocation);

      const userAddress = addressInfo.address_name;
      console.log(userAddress);
      return {
        latitude,
        longitude,
        address: userAddress,
        message: '사용자 위치정보가 적용되었습니다.',
      };
    } catch (error) {
      console.error('Error updating location:', error);
      return { message: '사용자 위치정보를 업데이트하는데 실패했습니다.' };
    }
  }
}
