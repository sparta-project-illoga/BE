import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';

@Controller('post')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  // 댓글 생성
  @Post('comment/:postId')
  createComment(
    @Body() createPostCommentDto: CreatePostCommentDto,
    @UserInfo() user: User,
    @Param('postId') postId: number,
  ) {
    return this.postCommentService.createComment(
      createPostCommentDto,
      user.id,
      postId,
    );
  }
  // 게시글 내 전체댓글 조회
  @Get('comment/:postId')
  findAllCommentByPostId(@Param('postId') postId: number) {
    return this.postCommentService.findAllCommentByPostId(postId);
  }

  // 댓글 수정
  @Patch('comment/:postId')
  updateComment(
    @Param('postId') postId: number,
    @Body() updatePostCommentDto: UpdatePostCommentDto,
    @UserInfo() user: User,
  ) {
    return this.postCommentService.updateComment(
      postId,
      updatePostCommentDto,
      user.id,
    );
  }

  // 댓글 삭제
  @Delete('comment/:postId')
  removeComment(@Param('postId') postId: number, @UserInfo() user: User) {
    return this.postCommentService.removeComment(postId, user);
  }
}
