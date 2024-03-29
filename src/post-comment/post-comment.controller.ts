import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';

@Controller('post-comment')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @Post()
  create(@Body() createPostCommentDto: CreatePostCommentDto) {
    return this.postCommentService.create(createPostCommentDto);
  }

  @Get()
  findAll() {
    return this.postCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostCommentDto: UpdatePostCommentDto) {
    return this.postCommentService.update(+id, updatePostCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postCommentService.remove(+id);
  }
}
