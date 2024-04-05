import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  //카테고리 생성
  @Post(':planId')
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
  @Get(':planId')
  async findAll(@Param('planId') planId: number) {
    const categories = await this.categoryService.findAll(planId);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 플랜의 카테고리를 조회하였습니다.',
      categories,
    };
  }

  //카테고리 수정
  @Patch(':categoryId')
  async update(@Param('categoryId') categoryId: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryService.update(categoryId, updateCategoryDto.category_name);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 카테고리를 수정하였습니다.',
      category,
    };
  }

  //카테고리 삭제
  @Delete(':categoryId')
  async remove(@Param('categoryId') categoryId: number) {
    const category = await this.categoryService.remove(categoryId);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 카테고리를 삭제하였습니다.',
      category,
    };
  }
}
