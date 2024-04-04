import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { Category } from './entities/category.entity';
import _ from 'lodash';
import { CategoryName } from './types/category.type';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
  ) { }

  async create(planId: number, category_name: CategoryName) {
    const plan = await this.planRepository.findOneBy({ id: planId });

    if (!plan) {
      throw new NotFoundException('해당 플랜이 존재하지 않습니다.');
    }

    const category = await this.categoryRepository.save({ planId, category_name })


    return category;
  }

  async findAll(planId: number) {
    const category = await this.categoryRepository.find({ where: { planId } })

    return category;
  }


  // async update(categoryId: number, category_name: CategoryName) {

  //   const category = await this.categoryRepository.findOneBy({ categoryId });

  //   if (_.isNil(category)) {
  //     throw new NotFoundException('해당 카테고리가 존재하지 않습니다.')
  //   }

  //   await this.categoryRepository.update({ categoryId }, { category_name });


  //   return await this.categoryRepository.findOneBy({ categoryId });
  // }

  async remove(categoryId: number) {
    const category = await this.categoryRepository.find({ where: { categoryId } });

    if (_.isNull(category)) {
      throw new BadRequestException('이미 삭제된 카테고리입니다.');
    }

    await this.categoryRepository.delete({ categoryId });

    return category;
  }
}
