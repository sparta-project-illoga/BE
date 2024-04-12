import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer'
import Mail from "nodemailer/lib/mailer";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class MailerService {
  // nodemailer에서 제공하는 Transporter 객체 생성
  private transporter: Mail
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.transporter = nodemailer.createTransport({
      // SMTP 설정
      service: 'gmail',
      host: 'smtp.gmail.com', //smtp 호스트
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('GMAIL_ID'),
        pass: this.configService.get<string>('GMAIL_SECRET'),
      }
    });
  }

  async sendVerifyToken(email: string) {
    const getRandomCode = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };

    const randomCode = getRandomCode(111111, 999999);

    const redisClient = this.redisService.getClient();
    await redisClient.del(`verification_code:${email}:unverified`); // 이전에 보낸 키 삭제
    const ser = await redisClient.set(`verification_code:${email}:unverified`, randomCode, 'EX', 300); // 300초(5분) 동안 유효

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('GMAIL_ID'), 
        to: email, //string or Array
        subject: '[illoga] 이메일 인증번호입니다.',
        text: `The Authentication code is ${randomCode}`,

      });
      console.log('메일이 전송되었습니다')
    } catch (error) {
      console.error('메일 전송 중 오류가 발생했습니다:', error);
      throw new Error(`메일 전송 실패: ${error.message}`);
    }
  }

  async sendNewPass(email: string, password: string) {  
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('GMAIL_ID'), 
        to: email,
        subject: '[illoga] 임시 비밀번호를 확인해주세요.',
        text: `Your New Password is ${password}`,
      });
      console.log('메일이 전송되었습니다');
    } catch (error) {
      console.error('메일 전송 중 오류가 발생했습니다:', error);
      throw new Error(`메일 전송 실패: ${error.message}`);
    }
  }
}