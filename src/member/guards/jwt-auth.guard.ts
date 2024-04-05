import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}

// import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//     canActivate(context: ExecutionContext) {
//         const canActivate = super.canActivate(context);
//         if (!canActivate) {
//             throw new UnauthorizedException('유효한 인증 토큰이 필요합니다.');
//         }
//         return canActivate;
//     }
// }