import { SetMetadata } from '@nestjs/common';
import { MemberType } from 'src/member/types/member.type';

export const MEMBERS_KEY = 'members';
export const Members = (...members: MemberType[]) => SetMetadata(MEMBERS_KEY, members);