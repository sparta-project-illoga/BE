import { Test, TestingModule } from '@nestjs/testing';
import { PostCommentController } from './post-comment.controller';
import { PostCommentService } from './post-comment.service';

describe('PostCommentController', () => {
  let controller: PostCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCommentController],
      providers: [PostCommentService],
    }).compile();

    controller = module.get<PostCommentController>(PostCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
