import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
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
  async register(@Body() registerDto: RegisterDto) {
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

  // 인증메일 전송
  @Post('sendverify')
  async sendVerification(@Body('email') email: string) {
    return await this.userService.sendVerification(email)
  }

  // 인증번호 검증
  @Post('verifycode')
  async verifyUser(@Body('email') email: string, @Body('code') code: string) {
    return await this.userService.verifyUser(email, code)
  }

  // TODO 비밀번호 확인

  // 회원탈퇴
  @UseGuards(AuthGuard('jwt'))
  @Delete('leave/:id')
  remove(@UserInfo() user: User, @Param('id') id:number) {
    return this.userService.remove(user.id, id);
  }
}
