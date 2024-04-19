import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/types/userRole.type';
import { Schedule } from './entities/schedule.entity';

describe('ScheduleController', () => {
  let controller: ScheduleController;
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [{
        provide: ScheduleService,
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
        }
      }],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a schedule', async () => {
      const planId = 1;
      const createScheduleDto: CreateScheduleDto = {
        date: 1, placecode: 1, money: 1000
      };
      const user: User = {
        id: 1, email: "mnbqwe123987@naver.com", password: "qwe123", name: "김민건", nickname: "gim", phone: "010-8932-4360",
        is_verify: false, role: Role.User, created_at: new Date(), updated_at: new Date(),
        plan: null, post: null, location: null, content: null, postComment: null, member: null
      };
      const createdSchedule: Schedule = {
        "createSchedule": {
        }

      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(createdSchedule);

      const result = await controller.create(planId, createScheduleDto, user);

      expect(result.createSchedule).toEqual(createdSchedule);
    });
  });

  describe('findAll', () => {
    it('should return all schedules for a plan', async () => {
      const planId = 1;
      const schedules = [{ /* mock schedule object 1 */ }, { /* mock schedule object 2 */ }];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(schedules);

      const result = await controller.findAll(planId);

      expect(result.findAllSchedule).toEqual(schedules);
    });
  });

  describe('update', () => {
    it('should update a schedule', async () => {
      const planId = 1;
      const scheduleId = 1;
      const updateScheduleDto: UpdateScheduleDto = { placecode: 123, money: 2000 };
      const user: User = {
        id: 1, email: "mnbqwe123987@naver.com", password: "qwe123", name: "김민건", nickname: "gim", phone: "010-8932-4360",
        is_verify: false, role: Role.User, created_at: new Date(), updated_at: new Date(),
        plan: null, post: null, location: null, content: null, postComment: null, member: null
      };
      const updatedSchedule = { /* mock updated schedule object */ };

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedSchedule);

      const result = await controller.update(planId, scheduleId, updateScheduleDto, user);

      expect(result).toEqual(updatedSchedule);
    });
  });

  describe('remove', () => {
    it('should remove a schedule', async () => {
      const planId = 1;
      const scheduleId = 1;
      const user: User = {
        id: 1, email: "mnbqwe123987@naver.com", password: "qwe123", name: "김민건", nickname: "gim", phone: "010-8932-4360",
        is_verify: false, role: Role.User, created_at: new Date(), updated_at: new Date(),
        plan: null, post: null, location: null, content: null, postComment: null, member: null
      };
      const removedSchedule = { /* mock removed schedule object */ };

      jest.spyOn(service, 'remove').mockResolvedValueOnce(removedSchedule);

      const result = await controller.remove(planId, scheduleId, user);

      expect(result).toEqual(removedSchedule);
    });
  });

});
