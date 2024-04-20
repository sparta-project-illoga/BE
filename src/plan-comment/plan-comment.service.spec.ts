import { Test, TestingModule } from '@nestjs/testing';
import { PlanCommentService } from './plan-comment.service';

describe('PlanCommentService', () => {
  let service: PlanCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanCommentService],
    }).compile();

    service = module.get<PlanCommentService>(PlanCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
