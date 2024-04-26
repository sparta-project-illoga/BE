import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { MemberGuard } from 'src/utils/member.guard';

@UseGuards(AuthGuard('jwt'))
@ApiTags('카테고리 API')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  //카테고리 생성
  @UseGuards(MemberGuard)
  @Post('plan/:planId')
  @ApiOperation({ summary: '카테고리 생성 API', description: '카테고리를 생성한다.' })
  @ApiResponse({ description: '카테고리를 생성한다.', type: Category })
  async create(@Param('planId') planId: number, @Body() createCategoryDto: CreateCategoryDto) {
    console.log('카테고리 생성 planId, category_name : ', planId, createCategoryDto.category_name);
    const category = await this.categoryService.create(planId, createCategoryDto.category_name);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 플랜의 카테고리를 생성하였습니다.',
      category,
    };
  }

  //플랜에 해당하는 카테고리 조회
  @Get('plan/:planId')
  @ApiOperation({ summary: '카테고리 조회 API', description: '플랜에 저장된 카테고리를 조회한다.' })
  //@ApiResponse({ description: '플랜에 저장된 카테고리를 조회한다.', type: Category })
  async findAll(@Param('planId') planId: number) {
    const categories = await this.categoryService.findAll(planId);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 플랜의 카테고리를 조회하였습니다.',
      categories,
    };
  }

  //카테고리 수정
  @UseGuards(MemberGuard)
  @Patch(':categoryId')
  @ApiOperation({ summary: '카테고리 수정 API', description: '카테고리를 수정한다.' })
  async update(@Param('categoryId') categoryId: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryService.update(categoryId, updateCategoryDto.category_name);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 카테고리를 수정하였습니다.',
      category,
    };
  }

  //카테고리 삭제
  @UseGuards(MemberGuard)
  @Delete(':categoryId')
  @ApiOperation({ summary: '카테고리 삭제 API', description: '카테고리를 삭제한다.' })
  async remove(@Param('categoryId') categoryId: number) {
    const category = await this.categoryService.remove(categoryId);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 카테고리를 삭제하였습니다.',
      category,
    };
  }
}