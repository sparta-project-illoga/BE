import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다.',);
    }

    const hashedPassword = await hash(registerDto.password, 10)

    await this.userRepository.save({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      nickname: registerDto.nickname,
      phone: registerDto.phone
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'], // 유저 엔터티에서 id, email, password 필드만 선택
      where: { email: loginDto.email }, // userRepository에서 제공된 이메일로 사용자 찾음
    });
    if (!user) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    // 사용자가 일치하면 jwt 토큰 페이로드 구성
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '300s' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  // async sendEmail(id: number): Promise<boolean> {
  //   const user = await this.userService.findById(id);

  //   const getRandomCode = (min, max) => {
  //     min = Math.ceil(min);
  //     max = Math.floor(max);
  //     return Math.floor(Math.random() * (max - min)) + min;
  //   };

  //   const randomCode = getRandomCode(111111, 999999);

  //   const transport = nodemailer.createTransport({
  //     service: 'Gmail',
  //     secure: true,
  //     auth: {
  //       type: 'OAuth2',
  //       user: process.env.GMAIL_ID,
  //       clientId: process.env.GMAIL_CLIENT_ID,
  //       clientSecret: process.env.GMAIL_CLIENT_SECRET,
  //       refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  //       accessToken: process.env.GMAIL_ACCESS_TOKEN,
  //       expires: 3600,
  //     },
  //   });

  //   if (randomCode) {
  //     await this.cacheManager.get(`${user.email}'s AuthenticationCode`);
  //   }
  //   await this.cacheManager.set(
  //     `${user.email}'s AuthenticationCode`,
  //     randomCode,
  //   );

  //   const sendResult = await transport.sendMail({
  //     from: {
  //       name: '인증관리자',
  //       address: process.env.GMAIL_ID,
  //     },
  //     subject: '내 서비스 인증 메일',
  //     to: [user.email],
  //     text: `The Authentication code is ${randomCode}`,
  //   });
  //   return sendResult.accepted.length > 0;
  // }


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}
