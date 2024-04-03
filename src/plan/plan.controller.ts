import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('plan')
export class PlanController {
  constructor(
    private readonly planService: PlanService
  ) { }

  // 플랜 생성
  @Post("/activeness")
  async create(
    @Body() createPlanDto: CreatePlanDto) {
    const createPlan = await this.planService.create(createPlanDto);

    return {
      createPlan,
    };
  }

  // 플랜 수동 생성
  @Post("/passivity")
  async createpassive(
    @Body() CreatePlanDto: CreatePlanDto) {
      const createPlan = await this.planService
    }

  // 플랜에 스케쥴 등록
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePlanDto :UpdatePlanDto) {
    const updatePlan = await this.planService.update(id, updatePlanDto);

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
