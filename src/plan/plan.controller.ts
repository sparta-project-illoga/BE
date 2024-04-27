import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PickPlanDto } from './dto/pick-plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) { }

  // 1. 플랜 생성 post
  // 2. 플랜에 총예산/일정 넣기 patch

  // 플랜 생성
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@UserInfo() user: User) {
    const createPlan = await this.planService.create(user);

    return {
      createPlan,
    };
  }

  // 플랜 스케줄 자동 생성
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id/passivity') // 플랜 id 앞으로 땡김
  @UseInterceptors(FileInterceptor('file'))
  async createpassive(
    @Param('id') id: number,
    @Body() pickPlanDto: PickPlanDto,
    @UserInfo() user: User,
  ) {
    const createPlan = await this.planService.createpassive(
      id,
      pickPlanDto,
      user
    );

    return createPlan;
  }

  // 플랜 스케쥴 직접 등록
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id/activeness') // 플랜 id 앞으로 땡김
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Body() createPlanDto: CreatePlanDto,
    @UserInfo() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatePlan = await this.planService.update(
      id,
      createPlanDto,
      user,
      file,
    );

    return updatePlan;
  }

  // 플랜 전체 조회
  @Get()
  async findAll() {
    return this.planService.findAll();
  }

  // 플랜 조회 (좋아요 내림차순)
  @Get('popular')
  async getPopularPlans() {
    return this.planService.popularPlans();
  }

  // 플랜 조회 (빈플랜 제외)
  @Get('new')
  async findAllNew() {
    return this.planService.findAllNew();
  }

  // 플랜 상세 조회
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const findPlan = await this.planService.findOne(id);

    return findPlan;
  }

  // 플랜 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserInfo() user: User) {
    const deletePlan = await this.planService.remove(id, user);

    return deletePlan;
  }

  // 좋아요 기능
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/favorite')
  async toggleLike(@UserInfo() user: User, @Param('id') id: number) {
    return this.planService.toggleFavorite(user, id);
  }

  // 좋아요 개수 조회
  @Get(':id/favorite')
  async getFavoriteCount(@Param('id') id: number) {
    return this.planService.getFavoriteCount(id);
  }

    // 좋아요 상태 조회
    @UseGuards(AuthGuard('jwt'))
    @Get(':id/favorite/status')
    async getFavoriteStatus(@UserInfo() user: User, @Param('id') id: number) {
      return this.planService.getFavoriteStatus(user, id);
    }
}
