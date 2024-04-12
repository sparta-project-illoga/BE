import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class FindPwDto {
  @ApiProperty({
    example: 'jskim4695@naver.com',
    description: '유저 이메일',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @ApiProperty({
    example: '김진성',
    description: '유저 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  name: string;

  @ApiProperty({
    example: '010-1234-1234',
    description: '유저 전화번호',
    required: true,
  })
  @Matches(/^01[0-9]-[0-9]{4}-[0-9]{4}$/, { message: '휴대전화 번호의 형태는 000-0000-0000입니다.' })
  @Length(13, 13, { message: '휴대폰 번호는 13자리여야 합니다.' })
  @IsNotEmpty({ message: '휴대전화 번호를 입력해주세요.' })
  phone: string;
}
