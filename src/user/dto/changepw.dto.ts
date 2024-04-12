import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from "../decorator/password-metch.decorator";
import { ApiProperty } from '@nestjs/swagger';

export class ChangePwDto {
  @ApiProperty({
    example: '1234aaaa',
    description: '유저 현재 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  present_pw: string;

  @ApiProperty({
    example: '1234bbbb',
    description: '유저 새로운 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '변경할 비밀번호를 입력해주세요.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: '비밀번호는 최소 8자 이상이며, 최소 하나의 영문자와 하나의 숫자를 포함해야 합니다.' })
  password: string;
  
  @ApiProperty({
    example: '1234bbbb',
    description: '유저 새로운 비밀번호 확인',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  @Match('password', { message: '비밀번호 확인이 일치하지 않습니다.' })
  check_pw: string;
}
