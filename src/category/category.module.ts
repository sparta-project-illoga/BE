import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Category } from './entities/category.entity';
import { Plan } from 'src/plan/entities/plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Plan]),
    PassportModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule { }