import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { PlanCommentService } from './plan-comment.service';
import { CreatePlanCommentDto } from './dto/create-plan-comment.dto';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePlanCommentDto } from './dto/update-plan-comment.dto';

@Controller('plan')
export class PlanCommentController {
  constructor(private readonly planCommentService: PlanCommentService) {}

  // 댓글 생성
  @UseGuards(AuthGuard('jwt'))
  @Post(':planId/comment')
  createComment(
    @Body() createPlanCommentDto: CreatePlanCommentDto,
    @UserInfo() user: User,
    @Param('planId') planId: number,
  ) {
    return this.planCommentService.createComment(
      createPlanCommentDto,
      user.id,
      user.nickname,
      planId,
    );
  }
  // 게시글 내 전체댓글 조회
  @Get(':planId/comment')
  findAllCommentByPlanId(@Param('planId') planId: number) {
    return this.planCommentService.findAllCommentByPlanId(planId);
  }

  // 댓글 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch(':planId/comment/:commentId')
  updateComment(
    @Param('planId') planId: number,
    @Param('commentId') commentId: number,
    @Body() updatePlanCommentDto: UpdatePlanCommentDto,
    @UserInfo() user: User,
  ) {
    return this.planCommentService.updateComment(
      planId,
      commentId,
      updatePlanCommentDto,
      user.id,
    );
  }

  // 댓글 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete(':planId/comment/:commentId')
  removeComment(
    @Param('planId') planId: number,
    @Param('commentId') commentId: number,
    @UserInfo() user: User,
  ) {
    return this.planCommentService.removeComment(planId, commentId, user.id);
  }
}
