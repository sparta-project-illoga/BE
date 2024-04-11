import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberType } from './types/member.type';
import { Member } from './entities/member.entity';

describe('MemberController', () => {
  let controller: MemberController;
  let memberService: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [MemberService],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    memberService = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a member', async () => {
      const planId = 1;
      const createMemberDto: CreateMemberDto = { userId: 2 };
      const member: Member = {
        memberId: 1,
        planId: 1,
        userId: 2,
        name: 'Test User',
        type: MemberType.Member,
        plan: null,
        user: null,
      };

      jest.spyOn(memberService, 'create').mockImplementation(async () => member);

      const result = await controller.create(planId, createMemberDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: '해당 플랜에 멤버를 추가하였습니다.',
        member,
      });
    });

    describe('findAll', () => {
      it('should find all members of a plan', async () => {
        const planId = 1;
        const members: Member[] = [
          {
            memberId: 1,
            planId: 1,
            userId: 1,
            name: 'Test User 1',
            type: MemberType.Member,
            plan: null,
            user: null,
          },
          {
            memberId: 2,
            planId: 1,
            userId: 2,
            name: 'Test User 2',
            type: MemberType.Member,
            plan: null,
            user: null,
          },
        ];

        jest.spyOn(memberService, 'findAll').mockImplementation(async () => members);

        const result = await controller.findAll(planId);

        expect(result).toEqual({
          statusCode: HttpStatus.OK,
          message: '해당 플랜의 멤버 조회에 성공하였습니다.',
          members,
        });
      });
    });

    describe('update', () => {
      it('should update a member', async () => {
        const memberId = 1;
        const updateMemberDto: UpdateMemberDto = { userId: 3 }; // 변경될 userId
        const member: Member = {
          memberId: 1,
          planId: 1,
          userId: 3,
          name: 'Updated User',
          type: MemberType.Member,
          plan: null,
          user: null,
        };

        jest.spyOn(memberService, 'update').mockImplementation(async () => member);

        const result = await controller.update(memberId, updateMemberDto);

        expect(result).toEqual({
          statusCode: HttpStatus.OK,
          message: '해당 멤버를 수정하였습니다.',
          member,
        });
      });
    });

    describe('remove', () => {
      it('should remove a member', async () => {
        const memberId = 1;
        const member: Member = {
          memberId: 1,
          planId: 1,
          userId: 1,
          name: 'Test User',
          type: MemberType.Member,
          plan: null,
          user: null,
        };

        jest.spyOn(memberService, 'remove').mockImplementation(async () => member);

        const result = await controller.remove(memberId);

        expect(result).toEqual({
          statusCode: HttpStatus.OK,
          message: '해당 멤버를 삭제하였습니다.',
          member,
        });
      });
    });
  })
});;