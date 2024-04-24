import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  // 댓글 생성
  @UseGuards(AuthGuard('jwt'))
  @Post(':postId/comment')
  createComment(
    @Body() createPostCommentDto: CreatePostCommentDto,
    @UserInfo() user: User,
    @Param('postId') postId: number,
  ) {
    return this.postCommentService.createComment(
      createPostCommentDto,
      user.id,
      user.nickname,
      postId,
    );
  }
  // 게시글 내 전체댓글 조회
  @Get(':postId/comment')
  findAllCommentByPostId(@Param('postId') postId: number) {
    return this.postCommentService.findAllCommentByPostId(postId);
  }

  // 댓글 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch(':postId/comment/:commentId')
  updateComment(
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
    @Body() updatePostCommentDto: UpdatePostCommentDto,
    @UserInfo() user: User,
  ) {
    return this.postCommentService.updateComment(
      postId,
      commentId,
      updatePostCommentDto,
      user.id,
    );
  }

  // 댓글 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete(':postId/comment/:commentId')
  removeComment(
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
    @UserInfo() user: User,
  ) {
    return this.postCommentService.removeComment(postId, commentId, user.id);
  }
}
