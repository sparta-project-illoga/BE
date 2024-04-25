import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Request as RequestType } from 'express';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  // private static extractJWT(req: Request): string | null {
  //   const authorizationHeader = req.headers['Authorization']; // 헤더에서 'authorization' 가져오기
  //   if (authorizationHeader) {
  //     const [tokenType, token] = authorizationHeader.split(' ');
  //     if (tokenType !== 'Bearer') {
  //       throw new BadRequestException('토큰 타입이 일치하지 않습니다.');
  //     }
  //     if (!token) {
  //       throw new UnauthorizedException('토큰이 유효하지 않습니다.');
  //     }
  //     return token;
  //   }
  //   return null;
  // }
  private static extractJWT(req: RequestType): string | null {
    const { Authorization } = req.cookies;
    console.log('123:', Authorization);
    if (Authorization) {
      const [tokenType, token] = Authorization.split(' ');
      if (tokenType !== 'Bearer')
        throw new BadRequestException('토큰 타입이 일치하지 않습니다.');
      if (!token) {
        throw new UnauthorizedException('토큰이 유효하지 않습니다.');
      }
      return token;
    }
    return null;
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}
