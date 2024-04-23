import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../types/userRole.type';
import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Post } from 'src/post/entities/post.entity';
import { PostComment } from 'src/post-comment/entities/post-comment.entity';
import { Location } from 'src/location/entities/location.entity';
import { ChatContent } from 'src/chat/entities/chat_contents.entity';
import { Member } from 'src/member/entities/member.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Favorite } from 'src/plan/entities/favorite.entity';
import { PlanComment } from 'src/plan-comment/entities/plan-comment.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', unique: false, nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  nickname: string;

  @Column({ type: 'varchar', unique: false, nullable: false })
  phone: string;

  @Column({ type: 'boolean', unique: false, nullable: true, default: false })
  is_verify: boolean;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  image_url?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updated_at: Date;

  // @Column({ nullable: true }) // Refresh Token은 로그아웃시 Null 이 되기 때문에 Null값을 허용
  // @Exclude() // 특정 작업을 수행할 때 해당 특정 속성을 무시하도록 ORM 프레임워크에 지시
  // currentHashedRefreshToken?: string;

  @OneToMany(() => Plan, (plan) => plan.user)
  plan: Plan[];

  @OneToMany(() => PlanComment, (planComment) => planComment.user)
  planComment: PlanComment[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorite: Favorite[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  postComment: PostComment[];

  @OneToOne(() => Location, (location) => location.user)
  @JoinColumn()
  location: Location;

  @OneToMany(() => ChatContent, (content) => content.user)
  content: ChatContent[];

  @OneToMany(() => Member, (member) => member.user)
  member: Member[];
}
