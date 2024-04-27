import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Area } from './entities/area.entity';
import { TourSpot } from './entities/tour-spot.entity';
import * as fs from 'fs';
import * as path from 'path';
import { PuppeteerService } from 'src/utils/puppeteer.service';
import { TourSpotTag } from './entities/tour-spot-tag.entity';
import { Tag } from './entities/tag.entity';
import { Checkpoint } from './entities/check-point.entity';
import { chunk } from 'lodash';
@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(TourSpot)
    private readonly tourSpotRepository: Repository<TourSpot>,
    @InjectRepository(TourSpotTag)
    private readonly tourSpotTagRepository: Repository<TourSpotTag>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Checkpoint)
    private readonly checkpointRepository: Repository<Checkpoint>,
    private readonly configService: ConfigService,
    private readonly puppeteerService: PuppeteerService,
  ) {}
  // 사용자 위치 정보 업데이트
  async updateLocation(
    user: User,
    locationData: { latitude: number; longitude: number },
  ) {
    const { latitude, longitude } = locationData;
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
      const addressInfo = address || road_address;

      let userLocation = await this.locationRepository.findOne({
        where: { userId: user.id },
      });
      if (!userLocation) {
        userLocation = this.locationRepository.create({
          userId: user.id,
          latitude: latitude,
          longitude: longitude,
          address_name: addressInfo.address_name,
          region_1depth_name: addressInfo.region_1depth_name,
          region_2depth_name: addressInfo.region_2depth_name,
          region_3depth_name: addressInfo.region_3depth_name,
        });
        await this.locationRepository.save(userLocation);
        user.location = userLocation;
        await this.userRepository.save(user);
      } else {
        userLocation.latitude = latitude;
        userLocation.longitude = longitude;
        userLocation.address_name = addressInfo.address_name;
        userLocation.region_1depth_name = addressInfo.region_1depth_name;
        userLocation.region_2depth_name = addressInfo.region_2depth_name;
        userLocation.region_3depth_name = addressInfo.region_3depth_name;

        await this.locationRepository.save(userLocation);
        user.location = userLocation;
        await this.userRepository.save(user);

        return {
          latitude,
          longitude,
          address_name: addressInfo.address_name,
          message: '사용자 위치정보가 적용되었습니다.',
        };
      }
    } catch (error) {
      console.error('Error updating location:', error);
      return { message: '사용자 위치정보를 업데이트하는데 실패했습니다.' };
    }
  }

  async addArea() {
    try {
      const areaData = await fs.promises.readFile(
        './src/location/data/area-data.json',
        'utf-8',
      );
      const parsedAreaData = JSON.parse(areaData);
      for (const data of parsedAreaData) {
        const existingArea = await this.areaRepository.findOne({
          where: { areaCode: data.areaCode },
        });
        if (!existingArea) {
          const area = this.areaRepository.create(data);
          await this.areaRepository.save(area);
        }
      }
      return { message: '데이터 추가 성공' };
    } catch (error) {
      throw new Error('데이터 추가 실패');
    }
  }

  // 여행지 데이터 저장
  async addTourSpot() {
    try {
      const files = await fs.promises.readdir('./src/location/data/');
      const filePromises = files
        .filter(
          (file) => file.startsWith('areaBasedList') && file.endsWith('.json'),
        )
        .map(async (file) => {
          const filePath = path.join('./src/location/data/', file);
          const tourSpotData = await fs.promises.readFile(filePath, 'utf-8');
          const parsedTourSpotData = JSON.parse(tourSpotData);
          const tourSpotItems = parsedTourSpotData.response.body.items.item;
          await Promise.all(
            tourSpotItems.map(async (item) => {
              const existingTourSpot = await this.tourSpotRepository.findOne({
                where: { contentId: item.contentid },
              });
              if (!existingTourSpot) {
                const tourSpot = this.tourSpotRepository.create({
                  addr1: item.addr1,
                  addr2: item.addr2,
                  areaCode: item.areacode,
                  bookTour: item.booktour,
                  cat1: item.cat1,
                  cat2: item.cat2,
                  cat3: item.cat3,
                  contentId: item.contentid,
                  contentTypeId: item.contenttypeid,
                  createdTime: item.createdtime,
                  firstImage: item.firstimage,
                  firstImage2: item.firstimage2,
                  cpyrhtDivCd: item.cpyrhtDivCd,
                  mapX: item.mapx,
                  mapY: item.mapy,
                  mlevel: item.mlevel,
                  modifiedTime: item.modifiedtime,
                  sigunguCode: item.sigungucode,
                  tel: item.tel,
                  title: item.title,
                  zipCode: item.zipcode,
                });
                await this.tourSpotRepository.save(tourSpot);
              }
            }),
          );
        });
      await Promise.all(filePromises);
      return { message: '데이터 추가 성공' };
    } catch (error) {
      throw new Error('데이터 추가 실패');
    }
  }

  // 여행지 정보검색 (전체)
  async findAllTourSpot(page: number, limit: number) {
    const [results, total] = await this.tourSpotRepository.findAndCount({
      relations: ['tourSpotTags', 'tourSpotTags.tag'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: results.map((tourSpot) => ({
        ...tourSpot,
        tourSpotTags: tourSpot.tourSpotTags.map(
          (tourSpotTag) => tourSpotTag.tag.name,
        ),
      })),
      count: total,
      page: page,
      limit: limit,
    };
  }

  // 여행지 정보검색 (지역코드)
  async searchTourSpot(areaCode: string, page: number, limit: number) {
    try {
      const [results, total] = await this.tourSpotRepository.findAndCount({
        where: { areaCode: areaCode },
        relations: ['tourSpotTags', 'tourSpotTags.tag'],
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: results.map((tourSpot) => ({
          ...tourSpot,
          tourSpotTags: tourSpot.tourSpotTags.map(
            (tourSpotTag) => tourSpotTag.tag.name,
          ),
        })),
        count: total,
        page: page,
        limit: limit,
      };
    } catch (error) {
      throw new Error('여행지 검색에 실패했습니다.');
    }
  }

  // 여행지 정보검색 (키워드)
  async searchTourSpotByKeyword(keyword: string, page: number, limit: number) {
    if (!keyword) {
      return { data: [], total: 0, page, limit };
    }

    const [results, total] = await this.tourSpotRepository
      .createQueryBuilder('tourSpot')
      .leftJoinAndSelect('tourSpot.tourSpotTags', 'tourSpotTag')
      .leftJoinAndSelect('tourSpotTag.tag', 'tag')
      .where('tourSpot.title LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('tag.name LIKE :keyword', { keyword: `%${keyword}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: results.map((tourSpot) => ({
        ...tourSpot,
        tourSpotTags: tourSpot.tourSpotTags.map(
          (tourSpotTag) => tourSpotTag.tag.name,
        ),
      })),
      total,
      page,
      limit,
    };
  }

  // 여행지에 태그 스크롤링해서 넣기
  async searchTourSpotByPuppeteer() {
    try {
      const checkpointInfo = await this.loadCheckpoint();

      const tourSpots = await this.tourSpotRepository.find({
        where: { id: MoreThan(checkpointInfo.lastProcessedTourSpotId) },
      });

      const CHUNK_SIZE = 5; // 한 번에 처리할 여행지의 수를 설정합니다.
      const tourSpotChunks = chunk(tourSpots, CHUNK_SIZE);

      for (const tourSpotChunk of tourSpotChunks) {
        const tourSpotPromises = tourSpotChunk.map(async (tourSpot) => {
          const keyword = tourSpot.title;
          const scrapedData =
            await this.puppeteerService.getSearchContent(keyword);
          console.log(scrapedData);

          await this.tourSpotTagRepository.delete({
            tourSpot: { id: tourSpot.id },
          });

          const tourSpotTagsPromises = scrapedData.flatMap((data) =>
            data.tags.map(async (tagName) => {
              const tourSpotTag = new TourSpotTag();
              let tag = await this.tagRepository.findOne({
                where: { name: tagName },
              });
              if (!tag) {
                tag = this.tagRepository.create({ name: tagName });
                tag = await this.tagRepository.save(tag);
              }
              tourSpotTag.tourSpot = tourSpot;
              tourSpotTag.tag = tag;
              return tourSpotTag;
            }),
          );
          const tourSpotTags = await Promise.all(tourSpotTagsPromises);
          await this.tourSpotTagRepository.save(tourSpotTags);
          await this.saveCheckpoint(tourSpot.id);
        });

        await Promise.all(tourSpotPromises);
      }

      await this.resetCheckpoint();
    } catch (error) {
      setTimeout(async () => {
        try {
          await this.searchTourSpotByPuppeteer();
        } catch (error) {
          console.error('재시도 중 에러가 발생했습니다.', error);
        }
      }, 300);
      throw new Error('여행지 검색에 실패했습니다.');
    }
  }

  /*---------------체크포인트---------------*/
  private async loadCheckpoint(): Promise<Checkpoint> {
    const checkpointInfo = await this.checkpointRepository.findOne({
      where: { id: 1 },
    });
    return checkpointInfo || new Checkpoint();
  }

  private async saveCheckpoint(lastProcessedTourSpotId: number): Promise<void> {
    let checkpointInfo = await this.checkpointRepository.findOne({
      where: { id: 1 },
    });
    if (!checkpointInfo) {
      checkpointInfo = new Checkpoint();
    }
    checkpointInfo.lastProcessedTourSpotId = lastProcessedTourSpotId;
    await this.checkpointRepository.save(checkpointInfo);
  }

  private async resetCheckpoint(): Promise<void> {
    let checkpointInfo = await this.checkpointRepository.findOne({
      where: { id: 1 },
    });
    if (!checkpointInfo) {
      checkpointInfo = new Checkpoint();
    }
    checkpointInfo.lastProcessedTourSpotId = 0;
    await this.checkpointRepository.save(checkpointInfo);
  }
}
