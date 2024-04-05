import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Match } from '../decorator/password-metch.decorator';

export class RegisterDto {
  @IsEmail({}, { message: '이메일 형식을 확인해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: '비밀번호는 최소 8자 이상이며, 최소 하나의 영문자와 하나의 숫자를 포함해야 합니다.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  @Match('password', { message: '비밀번호 확인이 일치하지 않습니다.' })
  check_pw: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;

  @Matches(/^01[0-9]-[0-9]{4}-[0-9]{4}$/, { message: '휴대전화 번호의 형태는 000-0000-0000입니다.' })
  @Length(13, 13, { message: '휴대폰 번호는 13자리여야 합니다.' })
  @IsNotEmpty({ message: '휴대전화 번호를 입력해주세요.' })
  phone: string;
}