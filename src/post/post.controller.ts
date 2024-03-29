import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';
// import { userInfo } from 'os';
// import { User } from 'src/user/entities/user.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 게시물 생성
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return await this.postService.createPost(createPostDto);
  }

  // 게시물 전체 조회
  @Get()
  async findAllPost() {
    const posts = await this.postService.findAllPost();
    return posts;
  }
  // 게시물 단건 조회
  @Get(':postId')
  async findOnePostByPostId(@Param('postId') id: number) {
    const post = await this.postService.findOnePostByPostId(id);
    return post;
  }
  // 게시물 삭제
  @Delete(':postId')
  async removePost(@Param('postId') id: number) {
    return this.postService.removePost(id);
  }
  // 게시물 수정
  // @Patch(':postId')
  // async updatePost(
  //   @Param('postId') id: number,
  //   @Body() updatePostDto: UpdatePostDto,
  //   @userInfo() user: User,
  // ) {
  //   return this.postService.updatePost(id, updatePostDto, user.id);
  // }
}
