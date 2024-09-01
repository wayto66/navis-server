import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { CommentController } from 'src/modules/comment/comment.controller';
import { CommentService } from 'src/modules/comment/comment.service';

describe('CommentController', () => {
  let controller: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [CommentController],
      providers: [CommentService],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
