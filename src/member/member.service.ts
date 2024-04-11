import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateMemberDto } from './dto/update-member.dto';
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


    private eventGateway: EventsGateway,
  ) { }

  async create(planId: number, userId: number) {

    const plan = await this.planRepository.findOneBy({ id: planId });

    if (!plan) {
      throw new BadRequestException('해당 플랜은 존재하지 않습니다.');
    }
    ;
    const check = await this.memberRepository.findOne({ where: { planId, userId } });

    if (check) {
      throw new BadRequestException('이미 해당 플랜에 초대된 멤버입니다.');
    }

    const user = await this.userRepository.findOneBy({ id: userId });

    const member = await this.memberRepository.save({ planId, userId, name: user.nickname });

    this.eventGateway.addMember(member);

    return member;
  }

  async findAll(planId: number) {
    const members = await this.memberRepository.find({ where: { planId } });

    return members;
  }

  //memberguard에서 member 찾아서 return
  async findMember(userId: number, planId: number) {
    const member = await this.memberRepository.findOne({ where: { userId, planId } });

    return member;
  }

  async update(memberId: number, userId: number) {
    await this.memberRepository.update({ memberId }, { userId });

    const member = await this.memberRepository.findOneBy({ memberId });
    return member;
  }

  async remove(memberId: number) {
    const member = await this.memberRepository.findOneBy({ memberId });

    await this.memberRepository.delete({ memberId });

    return member;
  }
}
