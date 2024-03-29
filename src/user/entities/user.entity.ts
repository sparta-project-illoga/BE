import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../types/userRole.type';
import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';


// @Index('email', ['email'], { unique: true })
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

  @Column({ type: 'int', unique: false, nullable: true })
  local_cert?: number;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column( {type: 'varchar', nullable: true })
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
// // post
//   @OneToMany(() => Post, (post) => post.user)
//   post: Post[];
}
