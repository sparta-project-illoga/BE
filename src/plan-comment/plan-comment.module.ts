import { Module } from '@nestjs/common';
import { PlanCommentService } from './plan-comment.service';
import { PlanCommentController } from './plan-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanComment } from './entities/plan-comment.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlanComment, Plan]), PlanModule],
  controllers: [PlanCommentController],
  providers: [PlanCommentService],
})
export class PlanCommentModule {}
