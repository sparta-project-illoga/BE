import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { Plan } from '../plan/entities/plan.entity';
import { NotFoundException, BadGatewayException, BadRequestException } from '@nestjs/common';
import { CategoryName } from './types/category.type';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository;
  let planRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Plan),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get(getRepositoryToken(Category));
    planRepository = module.get(getRepositoryToken(Plan));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const planId = 1;
      const categoryName = CategoryName.test;
      const plan = { id: planId };
      const existingCategory = null;

      jest.spyOn(planRepository, 'findOne').mockResolvedValueOnce(plan);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(existingCategory);
      jest.spyOn(categoryRepository, 'save').mockImplementationOnce(category => Promise.resolve(category));

      const result = await service.create(planId, categoryName);

      expect(result).toEqual(expect.objectContaining({ planId, category_name: categoryName }));
    });

    it('should throw NotFoundException if plan does not exist', async () => {
      const planId = 1;

      jest.spyOn(planRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.create(planId, CategoryName.test)).rejects.toThrowError(NotFoundException);
    });

    it('should throw BadGatewayException if category already exists for plan', async () => {
      const planId = 1;
      const existingCategory = { categoryId: 1, planId, category_name: CategoryName.test };

      jest.spyOn(planRepository, 'findOne').mockResolvedValueOnce({});
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(existingCategory);

      await expect(service.create(planId, CategoryName.test)).rejects.toThrowError(BadGatewayException);
    });
  });

  describe('findAll', () => {
    it('should return all categories for a plan', async () => {
      const planId = 1;
      const categories: Category[] = [
        { categoryId: 1, planId, category_name: CategoryName.MOUNTAIN, createdAt: new Date(), updatedAt: new Date(), plan: null },
        { categoryId: 2, planId, category_name: CategoryName.test, createdAt: new Date(), updatedAt: new Date(), plan: null },
      ];

      jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce(categories);

      const result = await service.findAll(planId);

      expect(result).toEqual(categories);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = 1;
      const updatedCategory: Category = { categoryId, planId: 1, category_name: CategoryName.test, createdAt: new Date(), updatedAt: new Date(), plan: null };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(updatedCategory);
      jest.spyOn(categoryRepository, 'update').mockResolvedValueOnce(null);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(updatedCategory);

      const result = await service.update(categoryId, CategoryName.test);

      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const categoryId = 1;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(categoryId, CategoryName.test)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const categoryId = 1;
      const removedCategory: Category = { categoryId, planId: 1, category_name: CategoryName.test, createdAt: new Date(), updatedAt: new Date(), plan: null };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(removedCategory);
      jest.spyOn(categoryRepository, 'delete').mockResolvedValueOnce(null);

      const result = await service.remove(categoryId);

      expect(result).toEqual(removedCategory);
    });

    it('should throw BadRequestException if category does not exist', async () => {
      const categoryId = 1;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.remove(categoryId)).rejects.toThrowError(BadRequestException);
    });
  });
});
