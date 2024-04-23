import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Members } from './decorators/member.decorator';
import { MemberType } from './types/member.type';
import { AuthGuard } from '@nestjs/passport';
import { MemberGuard } from 'src/utils/member.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@UseGuards(MemberGuard)
@Controller('member')
@ApiTags('멤버 API')
export class MemberController {
  constructor(private readonly memberService: MemberService) { }

  //멤버 추가
  //리더만 가능
  @Members(MemberType.Leader)
  @Post('plan/:planId')
  @ApiOperation({ summary: '멤버 추가 API', description: '플랜에 멤버를 추가한다.' })
  async create(@Param('planId') planId: number, @Body() createMemberDto: CreateMemberDto) {
    const member = await this.memberService.create(planId, createMemberDto.nickname);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 플랜에 멤버를 추가하였습니다.',
      member
    };
  }

  //멤버 조회
  @Get('plan/:planId')
  @ApiOperation({ summary: '멤버 조회 API', description: '플랜에 추가된 멤버들을 조회한다.' })
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
  @ApiOperation({ summary: '멤버 수정 API', description: '플랜에 추가된 멤버를 수정한다.' })
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
  @ApiOperation({ summary: '멤버 삭제 API', description: '플랜에 추가된 멤버를 삭제한다.' })
  async remove(@Param('memberId') memberId: number) {
    const member = await this.memberService.remove(memberId);

    return {
      statusCode: HttpStatus.OK,
      message: '해당 멤버를 삭제하였습니다.',
      member
    };
  }
}
