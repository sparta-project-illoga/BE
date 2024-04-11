import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 게시물 생성
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPost(
    @UserInfo() user: User,
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

  // 지역별 게시물 조회
  @Get('region/:areaCode')
  getPostsByAreaCode(@Param('areaCode') areaCode: number) {
    return this.postService.getPostsByAreaCode(areaCode);
  }

  // 게시물 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete(':postId')
  async removePost(@UserInfo() user: User, @Param('postId') postId: number) {
    return this.postService.removePost(user, postId);
  }

  // 게시물 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @UserInfo() user: User,
  ) {
    return this.postService.updatePost(postId, updatePostDto, user);
  }
}
