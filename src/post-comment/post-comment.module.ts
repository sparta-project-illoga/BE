import { Module } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { PostCommentController } from './post-comment.controller';
import { Post } from 'src/post/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comment.entity';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment, Post]), PostModule],
  controllers: [PostCommentController],
  providers: [PostCommentService],
})
export class PostCommentModule {}
