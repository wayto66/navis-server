import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Project, TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CreateProjectDto } from 'src/modules/project/dto/create-project.dto';
import { SearchProjectDto } from 'src/modules/project/dto/search-project.dto';
import { UpdateProjectDto } from 'src/modules/project/dto/update-project.dto';
import { ProjectService } from 'src/modules/project/project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let prismaService: PrismaService;

  const dateNow = new Date();
  const sampleProject: Project = {
    id: 1,
    title: 'title',
    description: 'description',
    isActive: true,
    isDone: false,
    customerId: 1,
    priority: 'LOW',
    targetDate: dateNow,
    createdAt: dateNow,
    updatedAt: dateNow,
    userId: 1,
    status: 'IN_PROGRESS',
  };

  const mockPrismaService = {
    project: {
      create: jest.fn().mockResolvedValue(sampleProject),
      findMany: jest.fn().mockResolvedValue([sampleProject]),
      findUnique: jest.fn().mockResolvedValue(sampleProject),
      update: jest.fn().mockResolvedValue(sampleProject),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project with PENDING status when targetDate is provided', async () => {
      const createProjectDto: CreateProjectDto = {
        ...sampleProject,
      };

      const expectedProject = {
        ...createProjectDto,
        status: TaskStatus.PENDING,
      };
      mockPrismaService.project.create.mockResolvedValue(expectedProject);
      const result = await service.create(createProjectDto);

      expect(prismaService.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createProjectDto,
          status: TaskStatus.PENDING,
        }),
      });
      expect(result).toEqual(expectedProject);
    });

    it('should create a project with DEFINE_DEADLINE status when targetDate is not provided', async () => {
      const createProjectDto: CreateProjectDto = {
        ...sampleProject,
      };

      delete createProjectDto.targetDate;

      const expectedProject = {
        ...sampleProject,
        status: TaskStatus.DEFINE_DEADLINE,
      };

      mockPrismaService.project.create.mockResolvedValue(expectedProject);

      const result = await service.create({
        ...createProjectDto,
        targetDate: undefined,
      });

      expect(prismaService.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createProjectDto,
          status: TaskStatus.DEFINE_DEADLINE,
        }),
      });
      expect(result).toEqual(expectedProject);
    });
  });

  describe('search', () => {
    it('should search projects with provided criteria', async () => {
      const searchProjectDto: SearchProjectDto = {
        title: 'Test',
        userId: 1,
        customerId: 1,
        priority: 'HIGH',
        status: TaskStatus.PENDING,
        dateFrom: new Date('2023-01-01'),
        dateTo: new Date('2023-12-31'),
        page: 1,
        pageSize: 25,
      };

      const result = await service.search(searchProjectDto);

      expect(prismaService.project.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          title: { contains: 'Test', mode: 'insensitive' },
          userId: 1,
          customerId: 1,
          priority: 'HIGH',
          status: TaskStatus.PENDING,
          isDone: false,
          targetDate: { gte: expect.any(Date), lte: expect.any(Date) },
        }),
        include: { tasks: { select: { status: true } } },
      });
      expect(result).toEqual([sampleProject]);
    });
  });

  describe('findOne', () => {
    it('should find a project by id', async () => {
      const projectId = 1;

      const result = await service.findOne(projectId);

      expect(prismaService.project.findUnique).toHaveBeenCalledWith({
        where: { id: projectId },
        include: { tasks: true, comments: true },
      });
      expect(result).toEqual(sampleProject);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const projectId = 1;
      const updateProjectDto: UpdateProjectDto = { title: 'Updated Project' };

      const updatedProject = { ...sampleProject, ...updateProjectDto };

      jest
        .spyOn(prismaService.project, 'update')
        .mockResolvedValue(updatedProject);

      const result = await service.update(projectId, updateProjectDto);

      expect(prismaService.project.findUnique).toHaveBeenCalledWith({
        where: { id: projectId },
      });
      expect(prismaService.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: updateProjectDto,
      });
      expect(result).toEqual(updatedProject);
    });

    it('should throw NotFoundException when project is not found', async () => {
      const projectId = 1;
      const updateProjectDto: UpdateProjectDto = { title: 'Updated Project' };

      jest.spyOn(prismaService.project, 'findUnique').mockResolvedValue(null);

      await expect(service.update(projectId, updateProjectDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update status to PENDING when targetDate is added to a DEFINE_DEADLINE project', async () => {
      const projectId = 1;
      const updateProjectDto: UpdateProjectDto = { targetDate: new Date() };
      const existingProject: Project = {
        ...sampleProject,
        status: TaskStatus.DEFINE_DEADLINE,
      };
      const updatedProject = {
        ...existingProject,
        ...updateProjectDto,
        status: TaskStatus.PENDING,
      };

      mockPrismaService.project.findUnique.mockResolvedValue(existingProject);
      mockPrismaService.project.update.mockResolvedValue(updatedProject);

      const result = await service.update(projectId, updateProjectDto);

      expect(prismaService.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: { ...updateProjectDto, status: TaskStatus.PENDING },
      });
      expect(result).toEqual(updatedProject);
    });
  });

  describe('remove', () => {
    it('should return a string indicating removal of project', async () => {
      const projectId = 1;
      const result = await service.remove(projectId);
      expect(result).toBe(`This action removes a #${projectId} project`);
    });
  });
});
