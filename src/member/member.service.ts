import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { Member } from './entities/member.entity';
import { User } from 'src/user/entities/user.entity';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async create(planId: number, nickname: string) {

    const plan = await this.planRepository.findOneBy({ id: planId });

    if (!plan) {
      throw new BadRequestException('해당 플랜은 존재하지 않습니다.');
    }

    const user = await this.userRepository.findOneBy({ nickname });

    if (!user) {
      throw new BadRequestException('해당 유저는 존재하지 않습니다.');
    }

    const check = await this.memberRepository.findOne({ where: { planId, userId: user.id } });

    if (check) {
      throw new BadRequestException('이미 해당 플랜에 초대된 멤버입니다.');
    }

    const member = await this.memberRepository.save({ planId, userId: user.id });

    return { ...member, "nickname": nickname };
  }

  async findAll(planId: number) {
    const members = await this.memberRepository.find({
      where: { planId },
    });

    let mArr = [];

    for (let i = 0; i < members.length; i++) {
      const mId = members[i].memberId;
      const uId = members[i].userId;
      const user = await this.userRepository.findOne({
        where: { id: uId },
        select: { nickname: true }
      });
      const type = members[i].type;

      mArr.push({ memberId: mId, userId: uId, nickname: user.nickname, type: type });
    }
    return mArr;
  }

  //memberguard에서 member 찾아서 return
  async findMember(userId: number, planId: number) {
    const member = await this.memberRepository.findOne({
      where: { userId, planId },
    });

    return member;
  }

  async update(memberId: number, userId: number) {
    await this.memberRepository.update({ memberId }, { userId });

    const member = await this.memberRepository.findOne({
      where: { memberId }
    });

    const user = await this.userRepository.findOneBy({ id: userId });

    return { ...member, nickname: user.nickname };
  }

  async remove(memberId: number) {
    const member = await this.memberRepository.findOne({
      where: { memberId },
    });

    if (member.type === 'Leader') {
      throw new BadRequestException("플랜의 리더는 삭제할 수 없습니다.");
    }

    const user = await this.userRepository.findOneBy({ id: member.userId });

    await this.memberRepository.delete({ memberId });

    return { ...member, nickname: user.nickname };
  }
}
