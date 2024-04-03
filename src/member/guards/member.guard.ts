import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
//import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
//유저 authguard 가져오기
import { Member } from 'src/member/entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemberGuard extends JwtAuthGuard implements CanActivate {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
        private readonly reflector: Reflector,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authenticated = await super.canActivate(context);
        if (!authenticated) {
            throw new UnauthorizedException('인증 정보가 잘못되었습니다.');
        }

        const req = context.switchToHttp().getRequest();
        const userId = req.user.id;
        const planId = req.params.planId;

        console.log('member-guard: userId, planId', userId, planId);

        const member = await this.memberRepository.findOne({
            where: { userId, planId },
        });

        console.log('member: ', member);

        if (!member) {
            throw new ForbiddenException('해당 플랜의 멤버가 아닙니다.');
        }

        return true;
    }
}
