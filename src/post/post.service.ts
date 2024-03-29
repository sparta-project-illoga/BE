import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  createPost(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAllPost() {
    return `This action returns all post`;
  }

  findOnePostByPostId(id: number) {
    return `This action returns a #${id} post`;
  }

  // updatePost(id: number, updatePostDto: UpdatePostDto, userId: number) {
  //   return `This action updates a #${id} post`;
  // }

  removePost(id: number) {
    return `This action removes a #${id} post`;
  }
}
