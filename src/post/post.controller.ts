import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/user/entities/user.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 게시물 생성
  @Post()
  async createPost(
    @userInfo() user: User,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.createPost(user, createPostDto);
  }

  // 게시물 전체 조회
  @Get()
  async findAllPost() {
    const posts = await this.postService.findAllPost();
    return posts;
  }
  // 게시물 단건 조회
  @Get(':postId')
  async findOnePostByPostId(@Param('postId') postId: number) {
    const post = await this.postService.findOnePostByPostId(postId);
    return post;
  }
  // 게시물 삭제
  @Delete(':postId')
  async removePost(@userInfo() user: User, @Param('postId') postId: number) {
    return this.postService.removePost(user, postId);
  }
  // 게시물 수정
  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @userInfo() user: User,
  ) {
    return this.postService.updatePost(postId, updatePostDto, user);
  }
}
