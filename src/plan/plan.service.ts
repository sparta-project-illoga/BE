import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PickPlanDto } from './dto/pick-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ReturnDocument } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { ScheduleService } from '../schedule/schedule.service';
import { Place } from './entities/place.entity';
import { CategoryService } from 'src/category/category.service';
import { Member } from 'src/member/entities/member.entity';
import { MemberType } from "src/member/types/member.type";
import { User } from 'src/user/entities/user.entity';
import { AwsService } from 'src/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { RedisService } from 'src/redis/redis.service';

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
    private redisService: RedisService

  ) { }

  async setPlanTime (planId: number) {
    const redisClient = this.redisService.getClient();
    const key = `plan_expiration:${planId}`;
    const timeSet = 30;
    await redisClient.set(key, "true", "EX", timeSet)
    
  }

  async deleteSetPlanTime (planId: number) {
    const redisClient = this.redisService.getClient();
    const key = `plan_expiration:${planId}`;
    await redisClient.del(key);
  }

  // 1. 플랜 생성 (단 총 예산과 일정은 추가가 안됨)
  async create( user: User) {

    const createPlan = await this.planRepository.save({
      userId : user.id
    });

    const memberLeader = await this.memberRepository.save({
      name : user.name,
      planId : createPlan.id,
      userId : user.id,
      type : MemberType.Leader,
    })

    // await this.setPlanTime(createPlan.id);

    return { createPlan, memberLeader };
  }

  // 스케줄 가져와서 생성
  async createpassive(
    id: number ,
    pickPlanDto: PickPlanDto, 
    user: User,
    file? : Express.Multer.File
  ) {

    const plan = await this.planRepository.findOne({
      where : {id}
    });

    if (!plan) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    if (plan.userId !== user.id) {
      throw new BadRequestException('작성자만 등록할 수 있습니다.');
    }

    const {name,pickplan} = pickPlanDto;

    let imageUrl = plan.image;

    if(file) {
      if (plan.image !== null) {
        await this.awsService.deleteUploadToS3(plan.image);
      }
    }

    const imageName = this.utilsService.getUUID();
    const ext = file? file.originalname.split('.').pop() : null;

    if (ext) {
      imageUrl = await this.awsService.imageUploadToS3(
        `${imageName}.${ext}`,
        file,
        ext,
      );
    }

    const findSchedule = await this.scheduleService.findAll(pickplan);

    for (const schedule of findSchedule.schedule) {
      await this.scheduleService.pasteSchedule(id,schedule);
    }

    const findPlace = await this.scheduleService.findAllPlace(pickplan);

    for (const place of findPlace.place) {
      await this.scheduleService.pasteplace(id, place);
    }

    const totalschedule = await this.scheduleService.findAll(id);

    const lastScehdule = await this.scheduleService.lastScehdule(id);

    const totalmoney = totalschedule.schedule.reduce((total, schedule) => total + schedule.money, 0);

    // await this.deleteSetPlanTime(id);

    await this.planRepository.update(
      {id},
      {
        name,
        image : `${imageName}.${ext}`,
        totaldate : lastScehdule.date,
        totalmoney
      }
    );

    return totalschedule;

  }

  // 2. 플랜 총 일정 및 에산 추가
  async update(
    id: number, 
    createPlanDto: CreatePlanDto,
    user: User, 
    file? : Express.Multer.File
  ) {

    const plan = await this.planRepository.findOne({
      where : {id}
    })

    if (!plan) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    if (plan.userId !== user.id) {
      throw new BadRequestException('작성자만 등록할 수 있습니다.');
    }

    let imageUrl = plan.image;

    if(file) {
      if (plan.image !== null) {
        await this.awsService.deleteUploadToS3(plan.image);
      }
    }

    const imageName = this.utilsService.getUUID();
    const ext = file? file.originalname.split('.').pop() : null;

    if (ext) {
      imageUrl = await this.awsService.imageUploadToS3(
        `${imageName}.${ext}`,
        file,
        ext,
      );
    }

    const totalschedule = await this.scheduleService.findAll(id);

    const lastScehdule = await this.scheduleService.lastScehdule(id);

    const totalmoney = totalschedule.schedule.reduce((total, schedule) => total + schedule.money, 0);

    await this.planRepository.update(
      { id },
      {
        name : createPlanDto.name,
        image : `${imageName}.${ext}`,
        totaldate : lastScehdule.date,
        totalmoney,
      });

      // await this.deleteSetPlanTime(id);

      const findPlan = await this.planRepository.findOne({
        where: { id }
      })
  
      const findPlace = await this.placeRepository.find({where: {planId : id}});

      return {findPlan,findPlace,totalschedule};

  }

  async findAll() {
    const plan = await this.planRepository.find();

    if (!plan || plan.length === 0) {
      throw new NotFoundException("플랜이 없습니다")
    }

    return plan
  }

  // 플랜 상세 조회 (여기서 총 지역,예산,일정 및 스케줄 조회)
  async findOne(id: number) {
    const findOnePlan = await this.planRepository.findOne({
      where: { id },
    });

    if (!findOnePlan) {
      throw new NotFoundException("플랜이 없습니다.");
    }

    const findSchedule = await this.scheduleService.findAll(id);

    const findPlace = await this.placeRepository.find({where: {planId : id}});

    const category = await this.categoryService.findAll(id);

    return { findOnePlan,findPlace, category, findSchedule };
  }

  // 플랜 삭제(동일 지역이 있을 경우 총 지역에 삭제 x)
  async remove(id: number, user: User) {

    const plan = await this.planRepository.findOne({
      where : {id}
    })

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
    await this.placeRepository.delete({planId : id});

    // 관련 멤버 삭제
    await this.memberRepository.delete({planId: id});

    return { plan };
  }
}
