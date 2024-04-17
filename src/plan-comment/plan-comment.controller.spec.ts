import { Test, TestingModule } from '@nestjs/testing';
import { PlanCommentController } from './plan-comment.controller';
import { PlanCommentService } from './plan-comment.service';

describe('PlanCommentController', () => {
  let controller: PlanCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanCommentController],
      providers: [PlanCommentService],
    }).compile();

    controller = module.get<PlanCommentController>(PlanCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
