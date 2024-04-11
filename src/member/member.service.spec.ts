import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { Member } from './entities/member.entity';
import { User } from 'src/user/entities/user.entity';
import { EventsGateway } from 'src/events/events.gateway';
import { MemberService } from './member.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

describe('MemberService', () => {
  let service: MemberService;
  let memberRepository: Repository<Member>;
  let planRepository: Repository<Plan>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        EventsGateway,
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Plan),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    planRepository = module.get<Repository<Plan>>(getRepositoryToken(Plan));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a member', async () => {
      const planId = 1;
      const userId = 1;

      jest.spyOn(planRepository, 'findOne').mockResolvedValueOnce({ id: planId } as Plan);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({ id: userId, nickname: 'Test User' } as User);
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(memberRepository, 'save').mockResolvedValueOnce({ planId, userId, name: 'Test User' } as Member);

      const result = await service.create(planId, userId);

      expect(result).toEqual({ planId, userId, name: 'Test User' });
    });

    it('should throw BadRequestException if plan not found', async () => {
      const planId = 1;
      const userId = 1;

      jest.spyOn(planRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.create(planId, userId)).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if member already exists', async () => {
      const planId = 1;
      const userId = 1;

      jest.spyOn(planRepository, 'findOne').mockResolvedValueOnce({ id: planId } as Plan);
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce({} as Member);

      await expect(service.create(planId, userId)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should find all members of a plan', async () => {
      const planId = 1;
      const members = [{}, {}] as Member[];

      jest.spyOn(memberRepository, 'find').mockResolvedValueOnce(members);

      const result = await service.findAll(planId);

      expect(result).toEqual(members);
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      const memberId = 1;
      const userId = 2;

      jest.spyOn(memberRepository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce({ memberId, userId } as Member);

      const result = await service.update(memberId, userId);

      expect(result).toEqual({ memberId, userId });
    });
  });

  describe('remove', () => {
    it('should remove a member', async () => {
      const memberId = 1;
      const member = {} as Member;

      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(member);
      jest.spyOn(memberRepository, 'delete').mockResolvedValueOnce(undefined);

      const result = await service.remove(memberId);

      expect(result).toEqual(member);
    });
  });
});