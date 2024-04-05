import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { Member } from 'src/member/entities/member.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MemberService } from '../member.service';

@Injectable()
export class MemberGuard extends JwtAuthGuard implements CanActivate {
    constructor(
        //@InjectRepository(Member) private readonly memberRepository: Repository<Member>,
        @Inject(MemberService) private readonly memberService: MemberService,
        private readonly reflector: Reflector,
    ) {
        super();
        console.log('memberService : ', this.memberService);
    }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authenticated = await super.canActivate(context);
        if (!authenticated) {
            throw new UnauthorizedException('인증 정보가 잘못되었습니다.');
        }

        //추가
        // if (context.getType() !== 'ws') {
        //     return true;
        // }

        const req = context.switchToHttp().getRequest();
        const userId = req.user.id;
        const planId = req.params.planId;

        console.log('member-guard: userId, planId', userId, planId);
        console.log(typeof (userId));
        console.log(typeof (planId));
        console.log(this.memberService);

        //const member = await this.memberRepository.find({ where: { userId } });

        // console.log('member: ', member);

        // if (!member) {
        //     throw new ForbiddenException('해당 플랜의 멤버가 아닙니다.');
        // }

        return true;
    }
}
