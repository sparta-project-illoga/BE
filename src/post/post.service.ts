import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Area } from 'src/location/entities/area.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  // 게시물 생성
  async createPost(user: User, createPostDto: CreatePostDto) {
    const users = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['location'],
    });
    if (!users || !users.location) {
      throw new BadRequestException('사용자 또는 인증지역을 찾을 수 없습니다.');
    }
    const region = users.location.region_1depth_name;
    const area = await this.areaRepository.findOne({ where: { name: region } });
    if (!area) {
      throw new BadRequestException('해당 지역 코드를 찾을 수 없습니다.');
    }

    const newPost = new Post();
    newPost.title = createPostDto.title;
    newPost.content = createPostDto.content;
    newPost.image = createPostDto.image; //TODO - 이미지 추가 기능해야함! S3
    newPost.userId = user.id;
    newPost.user_nickname = user.nickname;
    newPost.region = users.location.region_1depth_name;
    newPost.areaCode = area.areaCode;
    const post = await this.postRepository.save(newPost);
    return post;
  }

  // 게시물 전체 조회
  async findAllPost() {
    const posts = await this.postRepository.find();
    return posts;
  }

  // 게시물 단건 조회
  async findOnePostByPostId(postId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    return post;
  }

  // 지역별 게시물 조회
  async getPostsByAreaCode(areaCode: number) {
    const posts = await this.postRepository.find({
      where: { areaCode },
    });

    return posts;
  }

  // 게시물 수정
  async updatePost(postId: number, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.findOnePostByPostId(postId);
    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    if (post.userId !== user.id) {
      throw new BadRequestException('작성자만 수정할 수 있습니다.');
    }
    const isChangedData =
      user.id !== undefined ||
      updatePostDto.title !== undefined ||
      updatePostDto.content !== undefined ||
      updatePostDto.image !== undefined;
    if (!isChangedData) {
      throw new BadRequestException('변경된 내용이 없습니다.');
    }
    await this.postRepository.update({ id: postId }, updatePostDto);
    return { message: '게시물이 수정되었습니다.' };
  }

  // 게시물 삭제
  async removePost(user: User, postId: number) {
    const post = await this.findOnePostByPostId(postId);
    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    if (post.userId !== user.id) {
      throw new BadRequestException('작성자만 삭제할 수 있습니다.');
    }
    await this.postRepository.remove(post);
    return { message: '게시물이 삭제되었습니다.' };
  }
}
