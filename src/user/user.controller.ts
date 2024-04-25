import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, UseInterceptors, UploadedFile, Query, Put, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserInfo } from 'src/utils/userInfo.decorator';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { FindPwDto } from './dto/findpw.dto';
import { ChangePwDto } from './dto/changepw.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('유저 API')
@ApiSecurity('cookieAuth', ['jwt'])
export class UserController {
  constructor(private readonly userService: UserService) { }

  //회원가입
  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '사용자 정보를 추가합니다.' })
  @ApiQuery({ name: 'type', required: false, description: '`sendmail`: 이메일 인증번호 전송, `verifycode`: 인증번호 검증. 이 파라미터가 없는 경우 일반 회원가입을 수행합니다.' })
  @ApiCreatedResponse({ description: '유저를 생성한다', type: RegisterDto })
  @ApiResponse({ status: 201, description: '회원가입에 성공하였습니다' })
  @HttpCode(201)
  async register(
    @Query('type') type: string,
    @Body() body: any) {
    // 이메일 인증번호 전송 로직 실행
    if (type === 'sendmail') {
      const email = body.email
      return await this.userService.sendVerification(email)
    }
    // 인증번호 검증 로직 실행
    if (type === 'verifycode') {
      const { email, code } = body;
      return await this.userService.verifyUser(email, code);
    }

    const registerDto: RegisterDto = body
    return await this.userService.register(registerDto);
  }

  //로그인
  @Post('login')
  @ApiOperation({ summary: '로그인', description: '아이디와 비밀번호를 통해 로그인을 진행' })
  @ApiCreatedResponse({
    description: '로그인 정보',
    schema: {
      example: {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impza2ltNDY5NUBnbWFpbC5jb20iLCJzdWIiOjcsImlhdCI6MTcxMjczNjQyMiwiZXhwIjoxNzEyNzM2NzIyfQ.0DtlYn-38fcLj8A95XItC11jgOaWbdM7L1GbX5EYVso",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impza2ltNDY5NUBnbWFpbC5jb20iLCJzdWIiOjcsImlhdCI6MTcxMjczNjQyMiwiZXhwIjoxNzEzMzQxMjIyfQ.YiQd2CG_gd80AcDqAAzAnQweBXtbFGtC6ezifslKaIU"
      },
    },
  })
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
  @ApiOperation({ summary: '프로필', description: '회원정보를 확인' })
  @ApiCreatedResponse({
    description: '회원 정보',
    schema: {
      example: {
        "id": 7,
        "email": "jskim4695@gmail.com",
        "name": "김진성",
        "nickname": "jin",
        "phone": "010-1234-1234",
        "is_cert": false,
        "role": 0,
        "image_url": "f423aba4-569b-4c80-bc4c-c0fb0e48a85c.png",
        "created_at": "2024-04-08T17:41:21.343Z"
      },
    },
  })
  async getInfo(@UserInfo() user: User) {
    const region = await this.userService.getRegion(user.id);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      phone: user.phone,
      role: user.role,
      image_url: user.image_url,
      created_at: user.created_at,
      region: region
    }
  }

  // 정보수정
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Patch('modify')
  @ApiOperation({ summary: '회원정보 수정', description: '회원정보를 수정' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nickname: { type: 'string', description: '유저 닉네임' },
        phone: { type: 'string', description: '유저 전화번호' },
        image_url: { type: 'string', description: '유저 이미지 URL' },
        file: {
          type: 'string',
          format: 'binary',
          description: '업로드할 파일',
        },
      },
    },
  })
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

  // 비밀번호 찾기
  @Post('findpw')
  @ApiOperation({ summary: '비밀번호 찾기', description: '유저의 이메일, 이름, 전화번호를 통해 비밀번호를 찾습니다.' })
  @ApiResponse({ status: 204, description: '비밀번호 찾기 요청 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @HttpCode(204)
  async findPassword(
    @Body() findPwDto: FindPwDto
  ) {
    await this.userService.findPw(findPwDto)
  }

  // 비밀번호 변경
  @UseGuards(AuthGuard('jwt'))
  @Put('changepw')
  @ApiOperation({ summary: '비밀번호 변경', description: '유저의 현재 비밀번호와 새로운 비밀번호를 사용하여 비밀번호를 변경합니다.' })
  @ApiResponse({ status: 200, description: '비밀번호 변경에 성공하였습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async changePw(
    @UserInfo() user: User,
    @Body() changePwDto: ChangePwDto
  ) {
    await this.userService.changePw(user.id, changePwDto)
    return { message: '비밀번호 변경에 성공하였습니다.' }
  }

  // 회원탈퇴
  @UseGuards(AuthGuard('jwt'))
  @Delete('leave/:id')
  @ApiOperation({ summary: '회원 탈퇴', description: '유저를 시스템에서 삭제합니다.' })
  @ApiResponse({ status: 204, description: '회원 탈퇴 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiParam({ name: 'id', required: true, description: '탈퇴할 유저의 ID', type: Number })
  @HttpCode(204)
  remove(@UserInfo() user: User, @Param('id') id: number) {
    return this.userService.remove(user.id, id);
  }
}
