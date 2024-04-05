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
import { Local } from 'src/local/entities/local.entity';
import { Location } from 'src/location/entities/location.entity';
import { ChatContent } from 'src/chat/entities/chat_contents.entity';
import { Member } from 'src/member/entities/member.entity';

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

  @Column({ type: 'varchar', unique: false, nullable: false })
  nickname: string;

  @Column({ type: 'int', unique: false, nullable: false })
  phone: number;

  @Column({ type: 'boolean', unique: false, nullable: true, default: false })
  is_cert?: boolean;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  image_url?: string

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updated_at: Date;

  // @Column({ nullable: true }) // Refresh Token은 로그아웃시 Null 이 되기 때문에 Null값을 허용
  // @Exclude() // 특정 작업을 수행할 때 해당 특정 속성을 무시하도록 ORM 프레임워크에 지시
  // currentHashedRefreshToken?: string;

  // TODO 관계확인하고 주석해제할 것.
  //   @OneToMany(() => , (plan) => plan.user)
  //   plan: Plan[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  postComment: PostComment[];

  @OneToMany(() => Local, (local) => local.user)
  local: Local[];

  @OneToOne(() => Location, (location) => location.user)
  @JoinColumn()
  location: Location

  @OneToMany(() => ChatContent, (content) => content.user)
  content: ChatContent[];

  @OneToMany(() => Member, (member) => member.user)
  member: Member[];
}