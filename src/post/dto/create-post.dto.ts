import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreatePostDto {
  // @IsNumber()
  // @IsNotEmpty({ message: '사용자 아이디를 입력해주세요.' })
  // userId: number;

  @IsString()
  @IsNotEmpty({ message: '게시글 제목을 입력해주세요.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '게시글 내용을 입력해주세요.' })
  content: string;

  @Column({ type: 'varchar', nullable: false })
  image: string;
}
