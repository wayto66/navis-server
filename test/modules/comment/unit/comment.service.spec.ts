import { Test, TestingModule } from '@nestjs/testing';
import { Comment } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CommentService } from 'src/modules/comment/comment.service';
import { CreateCommentDto } from 'src/modules/comment/dto/create-comment.dto';
import { SearchCommentDto } from 'src/modules/comment/dto/search-comment.dto';

describe('CommentService', () => {
  let service: CommentService;
  let prisma: PrismaService;

  const dateNow = new Date();

  const sampleComment: Comment = {
    content: 'content',
    createdAt: dateNow,
    id: 1,
    projectId: 1,
    taskId: 1,
    userId: 1,
    routineId: null,
  };

  const mockPrismaService = {
    comment: {
      create: jest.fn().mockResolvedValue(sampleComment),
      findMany: jest.fn().mockResolvedValue([sampleComment]),
      findUnique: jest.fn().mockResolvedValue(sampleComment),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const dto: CreateCommentDto = {
        content: 'content',
        userId: 1,
        projectId: 1,
        taskId: 1,
      };
      await expect(service.create(dto)).resolves.toEqual(sampleComment);
      expect(prisma.comment.create).toHaveBeenCalledTimes(1);
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: dto,
      });
    });

    it('should handle errors during creation', async () => {
      jest
        .spyOn(prisma.comment, 'create')
        .mockRejectedValue(new Error('Creation error'));
      const dto: CreateCommentDto = {
        content: 'content',
        userId: 1,
        projectId: 1,
        taskId: 1,
      };
      await expect(service.create(dto)).rejects.toThrow('Creation error');
    });
  });

  describe('search', () => {
    it('should search comments', async () => {
      const dto: SearchCommentDto = {
        projectId: 1,
        taskId: 1,
      };
      await expect(service.search(dto)).resolves.toEqual([sampleComment]);
      expect(prisma.comment.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: dto,
      });
    });

    it('should handle empty search results', async () => {
      jest.spyOn(prisma.comment, 'findMany').mockResolvedValue([]);
      const dto: SearchCommentDto = {
        projectId: 1,
        taskId: 1,
      };
      await expect(service.search(dto)).resolves.toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find one comment', async () => {
      const id = 1;
      await expect(service.findOne(id)).resolves.toEqual(sampleComment);
      expect(prisma.comment.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should handle comment not found', async () => {
      jest.spyOn(prisma.comment, 'findUnique').mockResolvedValue(null);
      const id = 999;
      await expect(service.findOne(id)).resolves.toBeNull();
    });
  });
});
