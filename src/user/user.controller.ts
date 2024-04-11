import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //회원가입
  @Post('register')
  async register(
    @Query('type') type: string,
    @Body() body: any) {
    // 이메일 인증번호 전송 로직 실행
    if (type==='sendmail') {
      const email = body.email
      return await this.userService.sendVerification(email)
    }
    // 인증번호 검증 로직 실행
    if (type==='verifycode') {
      const { email, code } = body;
      return await this.userService.verifyUser(email, code);
    }

    const registerDto: RegisterDto = body
    return await this.userService.register(registerDto);
  }

  //로그인
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.userService.login(loginDto);
    res.cookie('Authorization', `Bearer ${token.access_token}`);
    return token;
  }

  // 프로필
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  getInfo(@UserInfo() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      phone: user.phone,
      is_cert: user.is_cert,
      role: user.role,
      image_url: user.image_url,
      created_at: user.created_at,     
    }
  }

  // 정보수정
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Patch('modify')
  async update(
    @UserInfo() user: User, 
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    ) {
    const updatedProfile = await this.userService.update(
      user.id,
      updateUserDto,
      file
      );
    return updatedProfile
  }

  // TODO 비밀번호 확인

  // 회원탈퇴
  @UseGuards(AuthGuard('jwt'))
  @Delete('leave/:id')
  remove(@UserInfo() user: User, @Param('id') id:number) {
    return this.userService.remove(user.id, id);
  }
}
