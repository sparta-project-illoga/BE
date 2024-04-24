import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { MemberService } from 'src/member/member.service';


@Injectable()
export class MemberGuard extends JwtAuthGuard implements CanActivate {
    constructor(
        private readonly memberService: MemberService,
        private readonly reflector: Reflector,
    ) {
        super();
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

        //console.log("memberService : ", this.memberService);

        const member = await this.memberService.findMember(userId, planId);


        console.log('member: ', member);

        if (!member) {
            throw new ForbiddenException('해당 플랜의 멤버가 아닙니다.');
        }

        return true;
    }
}
