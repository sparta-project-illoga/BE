import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Members } from './decorators/member.decorator';
import { MemberType } from './types/member.type';
import { AuthGuard } from '@nestjs/passport';
import { MemberGuard } from 'src/utils/member.guard';

@UseGuards(AuthGuard('jwt'))
@UseGuards(MemberGuard)
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) { }

  //멤버 추가
  //리더만 가능
  @Members(MemberType.Leader)
  @Post(':planId')
  async create(@Param('planId') planId: number, @Body() createMemberDto: CreateMemberDto) {
    const member = await this.memberService.create(planId, createMemberDto.userId);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 플랜에 멤버를 추가하였습니다.',
      member
    };
  }

  //멤버 조회
  @Get(':planId')
  async findAll(@Param('planId') planId: number) {
    const members = await this.memberService.findAll(planId);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 플랜의 멤버 조회에 성공하였습니다.',
      members
    };
  }

  //멤버 수정
  //리더만 가능
  @Members(MemberType.Leader)
  @Patch(':memberId')
  async update(@Param('memberId') memberId: number, @Body() updateMemberDto: UpdateMemberDto) {
    const member = await this.memberService.update(memberId, updateMemberDto.userId);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 멤버를 수정하였습니다.',
      member
    };

  }

  //멤버 삭제
  //리더만 가능
  @Members(MemberType.Leader)
  @Delete(':memberId')
  async remove(@Param('memberId') memberId: number) {
    const member = await this.memberService.remove(memberId);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 멤버를 삭제하였습니다.',
      member
    };
  }
}
