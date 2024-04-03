import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comment.entity';
import { Repository } from 'typeorm';
import { PostService } from 'src/post/post.service';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    @Inject(PostService)
    private readonly postService: PostService,
  ) {}

  // 댓글 생성
  async createComment(
    createPostCommentDto: CreatePostCommentDto,
    userId: number,
    postId: number,
  ) {
    const post = await this.postService.findOnePostByPostId(postId);
    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다.');
    const comment = await this.postCommentRepository.save({
      createPostCommentDto,
      userId,
      postId,
    });
    return comment;
  }

  // 게시글 내 전체댓글 조회
  async findAllCommentByPostId(postId: number) {
    const post = await this.postService.findOnePostByPostId(postId);
    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다.');
    const comment = await this.postCommentRepository.find({
      where: { postId: postId },
    });
    return comment;
  }

  async updateComment(
    postId: number,
    updatePostCommentDto: UpdatePostCommentDto,
    userId: number,
  ) {
    const post = await this.postService.findOnePostByPostId(postId);
    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다.');
    if (post.userId !== userId) {
      throw new UnauthorizedException('게시물 작성자만 수정할 수 있습니다.');
    }

    const updateComment = await this.postCommentRepository.update(
      { postId, userId },
      updatePostCommentDto,
    );
    return updateComment;
  }

  async removeComment(postId: number, userId: number) {
    const post = await this.postService.findOnePostByPostId(postId);
    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다.');
    if (post.userId !== userId) {
      throw new UnauthorizedException('게시물 작성자만 수정할 수 있습니다.');
    }
    await this.postCommentRepository.delete(postId);
  }
}
