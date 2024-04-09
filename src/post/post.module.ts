import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';
import { PostComment } from 'src/post-comment/entities/post-comment.entity';
import { Area } from 'src/location/entities/area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, PostComment, Area])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
