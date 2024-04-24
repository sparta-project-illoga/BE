import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePlanCommentDto } from './dto/create-plan-comment.dto';
import { UpdatePlanCommentDto } from './dto/update-plan-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanComment } from './entities/plan-comment.entity';
import { Repository } from 'typeorm';
import { PlanService } from 'src/plan/plan.service';

@Injectable()
export class PlanCommentService {
  constructor(
    @InjectRepository(PlanComment)
    private readonly planCommentRepository: Repository<PlanComment>,
    @Inject(PlanService)
    private readonly planService: PlanService,
  ) {}

  // 댓글 생성
  async createComment(
    createPlanCommentDto: CreatePlanCommentDto,
    userId: number,
    nickname: string,
    planId: number,
  ) {
    const plan = await this.planService.findOne(planId);
    if (!plan) throw new NotFoundException('존재하지 않는 플랜입니다.');
    const comment = await this.planCommentRepository.save({
      content: createPlanCommentDto.content,
      userId,
      nickname,
      planId,
    });
    return comment;
  }

  // 플랜 내 전체댓글 조회
  async findAllCommentByPlanId(planId: number) {
    const comment = await this.planCommentRepository.find({
      where: { planId },
    });
    return comment;
  }

  // 댓글 수정
  async updateComment(
    planId: number,
    commentId: number,
    updatePlanCommentDto: UpdatePlanCommentDto,
    userId: number,
  ) {
    const comment = await this.planCommentRepository.findOne({
      where: { id: commentId, planId: planId },
    });
    if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다.');
    if (comment.userId !== userId) {
      throw new UnauthorizedException('댓글 작성자만 수정할 수 있습니다.');
    }

    await this.planCommentRepository.update(
      { id: commentId },
      updatePlanCommentDto,
    );
    return await this.planCommentRepository.findOne({
      where: { id: commentId },
    });
  }

  // 댓글 삭제
  async removeComment(planId: number, commentId: number, userId: number) {
    const comment = await this.planCommentRepository.findOne({
      where: { id: commentId, planId: planId },
    });
    if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다.');
    if (comment.userId !== userId) {
      throw new UnauthorizedException('댓글 작성자만 삭제할 수 있습니다.');
    }
    await this.planCommentRepository.delete(commentId);
    return { message: '댓글이 삭제되었습니다.' };
  }
}
