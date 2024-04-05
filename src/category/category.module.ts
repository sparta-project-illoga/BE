import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { Category } from './entities/category.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([Plan, Category])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}
