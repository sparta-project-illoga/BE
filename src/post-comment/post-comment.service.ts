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
    nickname: string,
    postId: number,
  ) {
    const post = await this.postService.findOnePostByPostId(postId);
    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다.');
    const comment = await this.postCommentRepository.save({
      content: createPostCommentDto.content,
      userId,
      nickname,
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

  // 댓글 수정
  async updateComment(
    postId: number,
    commentId: number,
    updatePostCommentDto: UpdatePostCommentDto,
    userId: number,
  ) {
    const post = await this.postService.findOnePostByPostId(postId);
    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다.');
    const comment = await this.postCommentRepository.findOne({
      where: { id: commentId, postId: postId },
    });
    if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다.');
    if (comment.userId !== userId) {
      throw new UnauthorizedException('댓글 작성자만 수정할 수 있습니다.');
    }

    await this.postCommentRepository.update(
      { id: commentId },
      updatePostCommentDto,
    );
    return await this.postCommentRepository.findOne({
      where: { id: commentId },
    });
  }

  // 댓글 삭제
  async removeComment(postId: number, commentId: number, userId: number) {
    const post = await this.postService.findOnePostByPostId(postId);
    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다.');
    const comment = await this.postCommentRepository.findOne({
      where: { id: commentId, postId: postId },
    });
    if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다.');
    if (comment.userId !== userId) {
      throw new UnauthorizedException('댓글 작성자만 삭제할 수 있습니다.');
    }
    await this.postCommentRepository.delete(commentId);
    return { message: '댓글이 삭제되었습니다.' };
  }
}
