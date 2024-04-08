import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer'
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class MailerService {
  // nodemailer에서 제공하는 Transporter 객체 생성
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async sendVerifyToken(email: string) {

    const getRandomCode = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };

    const randomCode = getRandomCode(111111, 999999);

    const redisClient = this.redisService.getClient();
    await redisClient.set(`verification_code:${email}`, randomCode, 'EX', 3600); // 3600초(1시간) 동안 유효
    console.log(redisClient)
    const transport = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('GMAIL_ID'), // ConfigService를 사용하여 환경 변수 접근
        clientId: this.configService.get<string>('GMAIL_CLIENT_ID'),
        clientSecret: this.configService.get<string>('GMAIL_CLIENT_SECRET'),
        refreshToken: this.configService.get<string>('GMAIL_REFRESH_TOKEN'),
        accessToken: this.configService.get<string>('GMAIL_ACCESS_TOKEN'),
        expires: 3600,
      },
    });

    const sendResult = await transport.sendMail({
      from: {
        name: '인증관리자',
        address: this.configService.get<string>('GMAIL_ID'),
      },
      subject: '[illoga] 이메일 인증번호입니다.',
      to: [email],
      text: `The Authentication code is ${randomCode}`,
    });
    return sendResult.accepted.length > 0;
  }
}