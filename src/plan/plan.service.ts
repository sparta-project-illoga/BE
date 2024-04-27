import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PickPlanDto } from './dto/pick-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { ScheduleService } from '../schedule/schedule.service';
import { Place } from './entities/place.entity';
import { CategoryService } from 'src/category/category.service';
import { Member } from 'src/member/entities/member.entity';
import { MemberType } from 'src/member/types/member.type';
import { User } from 'src/user/entities/user.entity';
import { AwsService } from 'src/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { RedisService } from 'src/redis/redis.service';
import { PlanType } from './types/plan.type';
import { Category } from 'src/category/entities/category.entity';
import { Area } from 'src/location/entities/area.entity';
import { Favorite } from './entities/favorite.entity';
import { join } from 'path';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    private scheduleService: ScheduleService,
    private categoryService: CategoryService,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private awsService: AwsService,
    private utilsService: UtilsService,
    private redisService: RedisService,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) { }

  // 1. 플랜 생성 (단 총 예산과 일정은 추가가 안됨)
  async create(user: User) {
    const createPlan = await this.planRepository.save({
      userId: user.id,
    });

    const memberLeader = await this.memberRepository.save({
      name: user.name,
      planId: createPlan.id,
      userId: user.id,
      type: MemberType.Leader,
    });

    return { createPlan, memberLeader };
  }

  // 제외하는 플랜 아이디 저장
  async saveRedisPlan(userId: number, randomPickPlanId: number) {
    const redisClient = this.redisService.getClient();
    const key = `pickPlanId:${userId}:${randomPickPlanId}`;
    const time = 3600 * 12;
    await redisClient.set(key, randomPickPlanId, 'EX', time);
  }

  // 레디스에 저장된 플랜 아이디 조회
  async getExludePlan(userId: number): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
      const redisClient = this.redisService.getClient();
      const setKeyPattern = `pickPlanId:${userId}:*`;

      redisClient.keys(setKeyPattern, async (err, keys) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const excludePlan = [];

          for (const key of keys) {
            const value = await redisClient.get(key);
            excludePlan.push(parseInt(value));
          }

          resolve(excludePlan);
        }
      });
    });
  }

  // 스케줄 자동 생성
  async createpassive(
    id: number,
    pickPlanDto: PickPlanDto,
    user: User,
  ) {
    // 관련 스케쥴 삭제
    await this.scheduleService.removeByplanId(id);

    // 관련 총지역 삭제
    await this.placeRepository.delete({ planId: id });

    // 관련 카테고리 삭제
    await this.categoryRepository.delete({ planId: id });

    const excludePlan = await this.getExludePlan(user.id);

    const plan = await this.planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    if (plan.userId !== user.id) {
      throw new BadRequestException('작성자만 등록할 수 있습니다.');
    }

    // placecode는 areacode를 검색하기 위해 사용한다
    const { name, category, placecode, money, date } = pickPlanDto;

    const SpotAreacode = await this.placeRepository.findOne({
      where: { areacode: placecode },
    });

    // 플랜 자동 생성 검색
    const AllPlacePlan = await this.placeRepository.find({
      where: { areacode: SpotAreacode.areacode },
    });

    const AllCategoryPlan = await this.categoryRepository.find({
      where: { category_name: category },
    });

    let categoryPlanId = AllCategoryPlan.map(
      (categoryPlan) => categoryPlan.planId,
    );

    let placePlanId = AllPlacePlan.map((placePlan) => placePlan.planId);

    const extractAutoPlan = this.planRepository.createQueryBuilder('plan');

    if (true) {
      extractAutoPlan.where('plan.type = :type', { type: PlanType.Self });

      if (category) {
        extractAutoPlan.andWhere('plan.id IN (:...categoryPlanId)', {
          categoryPlanId,
        });
      }

      if (money) {
        extractAutoPlan.andWhere('plan.totalmoney <= :money', { money });
      }

      if (date) {
        extractAutoPlan.andWhere('plan.totaldate = :date', { date });
      }

      if (placecode) {
        extractAutoPlan.andWhere('plan.id IN (:...placePlanId)', {
          placePlanId,
        });
      }
    }

    let findAutoPlan = await extractAutoPlan.getMany();

    findAutoPlan = findAutoPlan.filter(
      (plan) => !excludePlan.includes(plan.id),
    );

    console.log(findAutoPlan);

    if (findAutoPlan.length === 0) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    const randomNumber = Math.floor(Math.random() * findAutoPlan.length);
    const randomPickPlan = findAutoPlan[randomNumber];

    // 플랜 검색해서 랜덤으로 추출
    const findSchedule = await this.scheduleService.findAll(randomPickPlan.id);

    for (const schedule of findSchedule.schedule) {
      await this.scheduleService.pasteSchedule(id, schedule);
    }

    const findPlace = await this.scheduleService.findAllPlace(
      randomPickPlan.id,
    );

    for (const place of findPlace.place) {
      await this.scheduleService.pasteplace(id, place);
    }

    const totalschedule = await this.scheduleService.findAll(id);

    const lastScehdule = await this.scheduleService.lastScehdule(id);

    const totalmoney = totalschedule.schedule.reduce(
      (total, schedule) => total + schedule.money,
      0,
    );

    await this.planRepository.update(
      { id },
      {
        name,
        totaldate: lastScehdule.date,
        totalmoney,
        type: PlanType.Auto,
      },
    );

    await this.saveRedisPlan(user.id, randomPickPlan.id);

    return totalschedule;
  }

  // 2. 플랜 총 일정 및 에산 추가
  // 플랜 예산 및 일정 계산 삭제
  async update(
    id: number,
    createPlanDto: CreatePlanDto,
    user: User,
    file?: Express.Multer.File,
  ) {
    const plan = await this.planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    if (plan.userId !== user.id) {
      throw new BadRequestException('작성자만 등록할 수 있습니다.');
    }

    let imageUrl = plan.image;

    if (file) {
      if (plan.image !== null) {
        await this.awsService.deleteUploadToS3(plan.image);
      }
    }

    const imageName = this.utilsService.getUUID();
    const ext = join(file.originalname).split('.').pop()

    if (ext) {
      imageUrl = await this.awsService.imageUploadToS3(
        `${imageName}.${ext}`,
        file,
        ext,
      );
    }

    const totalschedule = await this.scheduleService.findAll(id);

    if (totalschedule.schedule.length < 1) {
      throw new NotFoundException('스케줄을 입력하지 않았습니다.');
    }

    await this.planRepository.update(
      { id },
      {
        name: createPlanDto.name,
        image: `${imageName}.${ext}`,
        type: PlanType.Self,
      },
    );

    const findPlan = await this.planRepository.findOne({
      where: { id },
    });

    const findPlace = await this.placeRepository.find({
      where: { planId: id },
    });

    return { findPlan, findPlace, totalschedule };
  }

  // 플랜 전체 조회
  async findAll() {
    const plan = await this.planRepository.find();

    if (!plan || plan.length === 0) {
      throw new NotFoundException('플랜이 없습니다');
    }

    return plan;
  }

  // 플랜 전체 조회 (빈플랜 제외)
  async findAllNew() {
    const plan = await this.planRepository.find({
      where: [{ totaldate: Not(IsNull()), totalmoney: Not(IsNull()) }],
    });
    if (!plan || plan.length === 0) {
      throw new NotFoundException('플랜이 없습니다');
    }
    return plan;
  }
  // 플랜 상세 조회 (여기서 총 지역,예산,일정 및 스케줄 조회)
  async findOne(id: number) {
    const findOnePlan = await this.planRepository.findOne({
      where: { id },
    });

    if (!findOnePlan) {
      throw new NotFoundException('플랜이 없습니다.');
    }

    const findSchedule = await this.scheduleService.findAll(id);

    const findPlace = await this.placeRepository.find({
      where: { planId: id },
    });

    const category = await this.categoryService.findAll(id);

    return { findOnePlan, findPlace, category, findSchedule };
  }

  // 플랜 삭제(동일 지역이 있을 경우 총 지역에 삭제 x)
  async remove(id: number, user: User) {
    const plan = await this.planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    if (plan.userId !== user.id) {
      throw new BadRequestException('작성자만 삭제할 수 있습니다.');
    }

    // 플랜삭제
    await this.planRepository.delete({ id });

    // 관련 스케쥴 삭제
    await this.scheduleService.removeByplanId(id);

    // 관련 총지역 삭제
    await this.placeRepository.delete({ planId: id });

    // 관련 카테고리 삭제
    await this.categoryRepository.delete({ planId: id });

    // 관련 멤버 삭제
    await this.memberRepository.delete({ planId: id });

    return { plan };
  }

  // 좋아요 기능
  async toggleFavorite(user: User, planId: number) {
    const plan = await this.planRepository.findOneBy({ id: planId });
    if (!plan) {
      throw new BadRequestException(`${planId}번 플랜을 찾을 수 없습니다.`);
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { user: { id: user.id }, plan: { id: planId } },
    });
    if (existingFavorite) {
      await this.favoriteRepository.remove(existingFavorite);
      plan.favoriteCount -= 1;
      await this.planRepository.save(plan);
      return `${planId}번 플랜 좋아요 취소`;
    } else {
      const newFavorite = this.favoriteRepository.create({ user, plan });
      await this.favoriteRepository.save(newFavorite);
      plan.favoriteCount += 1;
      await this.planRepository.save(plan);
      return `${planId}번 플랜 좋아요`;
    }
  }

  // 좋아요 개수 조회
  async getFavoriteCount(planId: number) {
    const plan = await this.planRepository.findOneBy({ id: planId });
    if (!plan) {
      throw new Error(`${planId}번 플랜을 찾을 수 없습니다.`);
    }

    return {
      planId: planId,
      favoriteCount: plan.favoriteCount,
    };
  }

  // 플랜 조회 (좋아요 내림차순)
  async popularPlans() {
    const plans = await this.planRepository
    .createQueryBuilder('plan')
    .where('plan.totaldate IS NOT NULL AND plan.totalmoney IS NOT NULL')
    .where('plan.favoriteCount > 0')
    .orderBy('plan.favoriteCount', 'DESC')
    .getMany();
    
    if (!plans || plans.length === 0) {
      throw new NotFoundException('플랜이 없습니다');
    }
    
    return plans;
  }
  // 좋아요 상태조회
    async getFavoriteStatus(user: User, planId: number) {
      const plan = await this.planRepository.findOneBy({ id: planId });
      if (!plan) {
        throw new BadRequestException(`${planId}번 플랜을 찾을 수 없습니다.`);
      }
  
      const existingFavorite = await this.favoriteRepository.findOne({
        where: { user: { id: user.id }, plan: { id: planId } },
      });
  
      return { isFavorite: !!existingFavorite };
  }
}
