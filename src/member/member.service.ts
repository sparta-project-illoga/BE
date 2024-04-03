import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
  ) { }

  async create(planId: number, userId: number) {

    const plan = await this.planRepository.findOneBy({ id: planId });

    if (!plan) {
      throw new BadRequestException('해당 플랜은 존재하지 않습니다.');
    }

    const member = await this.memberRepository.save({ id: planId, userId });

    return member;
  }

  async findAll(planId: number) {
    const members = await this.memberRepository.find({ where: { planId } });

    return members;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} member`;
  // }

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
