// 
//////////////////////////////////////////////////////////////////////////

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryName } from './types/category.type';
import { Category } from './entities/category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [{
        provide: CategoryService,
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
        }
      }],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const planId = 1;
      const categoryDto: CreateCategoryDto = { category_name: CategoryName.test };
      const createdCategory: Category = { categoryId: 1, planId, category_name: categoryDto.category_name, createdAt: new Date(), updatedAt: new Date(), plan: null };

      jest.spyOn(service, 'create').mockResolvedValueOnce(createdCategory);

      const result = await controller.create(planId, categoryDto);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.message).toBe('해당 플랜의 카테고리를 생성하였습니다.');
      expect(result.category).toEqual(createdCategory);
    });
  });

  describe('findAll', () => {
    it('should return all categories for a plan', async () => {
      const planId = 1;
      const categories: Category[] = [
        { categoryId: 1, planId, category_name: CategoryName.MOUNTAIN, createdAt: new Date(), updatedAt: new Date(), plan: null },
        { categoryId: 2, planId, category_name: CategoryName.test, createdAt: new Date(), updatedAt: new Date(), plan: null },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(categories);

      const result = await controller.findAll(planId);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.message).toBe('해당 플랜의 카테고리를 조회하였습니다.');
      expect(result.categories).toEqual(categories);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = 1;
      const updatedCategoryDto: UpdateCategoryDto = { category_name: CategoryName.SINGLE };
      const updatedCategory: Category = { categoryId, planId: 1, category_name: updatedCategoryDto.category_name, createdAt: new Date(), updatedAt: new Date(), plan: null };

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedCategory);

      const result = await controller.update(categoryId, updatedCategoryDto);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.message).toBe('해당 카테고리를 수정하였습니다.');
      expect(result.category).toEqual(updatedCategory);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const categoryId = 1;
      const removedCategory: Category = { categoryId, planId: 1, category_name: CategoryName.test, createdAt: new Date(), updatedAt: new Date(), plan: null };

      jest.spyOn(service, 'remove').mockResolvedValueOnce(removedCategory);

      const result = await controller.remove(categoryId);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.message).toBe('해당 카테고리를 삭제하였습니다.');
      expect(result.category).toEqual(removedCategory);
    });
  });

});