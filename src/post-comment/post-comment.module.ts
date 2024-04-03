import { Module } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { PostCommentController } from './post-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment, Post, User])],
  controllers: [PostCommentController],
  providers: [PostCommentService, PostService],
})
export class PostCommentModule {}
