import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PickPlanDto } from './dto/pick-plan.dto';
import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt'))
@Controller('plan')
export class PlanController {
  constructor(
    private readonly planService: PlanService
  ) { }

  // 1. 플랜 생성 post
  // 2. 플랜에 총예산/일정 넣기 patch

  // 플랜 생성
  @Post()
  async create(
    @Body() createPlanDto: CreatePlanDto) {
    const createPlan = await this.planService.create(createPlanDto);

    return {
      createPlan,
    };
  }

  // 플랜 스케줄 수동 생성
  @Patch("/passivity/:id")
  async createpassive(
    @Param("id") id: number, @Body() pickPlanDto : PickPlanDto) {
    const createPlan = await this.planService.createpassive(id,pickPlanDto);

    return createPlan;
  }

  // 플랜 스케쥴 직접 등록
  @Patch('activeness/:id')
  async update(@Param('id') id: number, @Body() createPlanDto: CreatePlanDto) {
    const updatePlan = await this.planService.update(id, createPlanDto);

    return updatePlan;
  }

  // 플랜 전체 조회
  @Get()
  async findAll() {
    return this.planService.findAll();
  }

  // 플랜 상세 조회
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const findPlan = await this.planService.findOne(id);

    return findPlan;
  }

  // 플랜 삭제
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const deletePlan = await this.planService.remove(id);

    return deletePlan;
  }
}
