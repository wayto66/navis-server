import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Task, TaskDependency, TaskPriority, TaskStatus } from '@prisma/client';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { ProjectService } from 'src/modules/project/project.service';
import { NotifyService } from '../../../../src/modules/notify/notify.service';
import { CreateTaskDto } from '../../../../src/modules/task/dto/create-task.dto';
import { TaskService } from '../../../../src/modules/task/task.service';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;
  let notifyService: NotifyService;

  const dateNow = new Date();

  const samepleTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    isActive: true,
    targetDate: dateNow,
    customerId: 1,
    assignedId: 1,
    creatorId: 1,
    projectId: 1,
    isDone: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const samplePrismaDependency: TaskDependency = {
    id: 1,
    taskId: 1,
    dependsOnId: 2,
  };

  const createTaskDto: CreateTaskDto = {
    title: 'Test Task',
    description: 'This is a test task',
    priority: TaskPriority.MEDIUM,
    targetDate: new Date(),
    customerId: 1,
    assignedId: 1,
    creatorId: 1,
    projectId: 1,
  };

  const mockNotifyService = {
    send: jest.fn(),
  };
  const mockProjectService = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        TaskService,
        {
          provide: NotifyService,
          useValue: mockNotifyService,
        },
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
    notifyService = module.get<NotifyService>(NotifyService);
  });

  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(prisma.task, 'create').mockResolvedValue(samepleTask);
    jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(samepleTask);
    jest.spyOn(prisma.task, 'findMany').mockResolvedValue([samepleTask]);
    jest.spyOn(prisma.task, 'update').mockResolvedValue(samepleTask);
    jest.spyOn(prisma.task, 'delete').mockResolvedValue(samepleTask);
    jest
      .spyOn(prisma.taskDependency, 'findMany')
      .mockResolvedValue([samplePrismaDependency]);
    jest
      .spyOn(prisma.taskDependency, 'createMany')
      .mockResolvedValue({ count: 1 });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task with no dependencies', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: TaskPriority.MEDIUM,
        isActive: true,
        targetDate: dateNow,
        customerId: 1,
        assignedId: 1,
        creatorId: 1,
        projectId: 1,
        dependsOnIds: [],
      };

      await expect(service.create(createTaskDto)).resolves.toEqual(samepleTask);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          status: TaskStatus.PENDING,
          isActive: undefined,
          dependsOnIds: undefined,
        },
        include: {
          assigned: false,
          creator: false,
        },
      });
      expect(prisma.taskDependency.createMany).not.toHaveBeenCalled();
      expect(notifyService.send).not.toHaveBeenCalled();
    });

    it('should create a locked task with dependencies', async () => {
      jest
        .spyOn(prisma.task, 'findMany')
        .mockResolvedValueOnce([
          { ...samepleTask, status: TaskStatus.PENDING },
        ]);

      jest.spyOn(prisma.task, 'create').mockResolvedValueOnce({
        ...samepleTask,
        // assigned: {
        //   phone: '123',
        // },
        status: TaskStatus.LOCKED,
      });

      const dto: CreateTaskDto = { ...createTaskDto, dependsOnIds: [2, 3] };

      await service.create(dto);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createTaskDto,
          status: TaskStatus.LOCKED,
        }),
        include: {
          assigned: false,
          creator: false,
        },
      });
      expect(prisma.taskDependency.createMany).toHaveBeenCalled();
    });

    it('should create a task and notify', async () => {
      const task: Task & { assigned: any; creator: any } = {
        ...samepleTask,
        assignedId: 2,
        assigned: {
          phone: '123',
          name: 'assigned',
        },
        creator: {
          phone: '234',
          name: 'creator',
        },
      };
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: TaskPriority.MEDIUM,
        customerId: 1,
        assignedId: 2,
        creatorId: 1,
        projectId: 1,
        targetDate: dateNow,
      };

      jest.spyOn(prisma.task, 'create').mockResolvedValueOnce(task);

      await service.create(createTaskDto);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          status: TaskStatus.PENDING,
        },
        include: {
          assigned: true,
          creator: true,
        },
      });
      expect(notifyService.send).toHaveBeenCalled();
    });

    it('should create a task with DEFINE_DEADLINE status when no target date', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: TaskPriority.MEDIUM,
        customerId: 1,
        assignedId: 1,
        creatorId: 1,
        projectId: 1,
        dependsOnIds: [],
      };

      const expectedDto = {
        ...createTaskDto,
        status: TaskStatus.DEFINE_DEADLINE,
        targetDate: undefined,
      };
      delete expectedDto.dependsOnIds;

      await service.create(createTaskDto);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining(expectedDto),
        include: {
          assigned: false,
          creator: false,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      await expect(service.findOne(samepleTask.id)).resolves.toEqual(
        samepleTask,
      );
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: samepleTask.id },
        include: {
          dependsOn: {
            include: {
              dependsOn: true,
              task: true,
            },
          },
          comments: true,
        },
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto = {
        title: 'Updated Task',
      };
      const updatedTask = { ...samepleTask, ...updateTaskDto };

      jest.spyOn(prisma.task, 'update').mockResolvedValue(updatedTask);

      const result = await service.update(1, updateTaskDto);
      expect(result).toEqual(updatedTask);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateTaskDto,
        include: {
          project: {
            include: {
              tasks: true,
            },
          },
        },
      });
    });

    it('should update task status to PENDING when target date is set', async () => {
      const updateTaskDto = {
        targetDate: new Date(),
      };
      const existingTask = {
        ...samepleTask,
        status: TaskStatus.DEFINE_DEADLINE,
      };
      const updatedTask = {
        ...existingTask,
        ...updateTaskDto,
        status: TaskStatus.PENDING,
      };

      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(existingTask);
      jest.spyOn(prisma.task, 'update').mockResolvedValue(updatedTask);

      const result = await service.update(1, updateTaskDto);
      expect(result).toEqual(updatedTask);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...updateTaskDto, status: TaskStatus.PENDING },
        include: {
          project: {
            include: {
              tasks: true,
            },
          },
        },
      });
    });

    it('should handle task completion', async () => {
      jest.spyOn(service, 'handleTaskCompletion').mockImplementation(jest.fn());

      const updateTaskDto = {
        status: TaskStatus.COMPLETED,
      };
      const existingTask = {
        ...samepleTask,
        project: {
          tasks: [],
        },
      };
      const updatedTask = {
        ...existingTask,
        ...updateTaskDto,
      };

      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(existingTask);
      jest.spyOn(prisma.task, 'update').mockResolvedValue(updatedTask);

      await service.update(1, updateTaskDto);

      expect(service.handleTaskCompletion).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(samepleTask);
      jest.spyOn(prisma.task, 'delete').mockResolvedValue(samepleTask);

      const result = await service.remove(1);
      expect(result).toEqual(samepleTask);
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('should search tasks with various parameters', async () => {
      const searchParams = {
        page: 1,
        pageSize: 10,
        title: 'test',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        // isActive: true,
        // isDone: false,
        // dateFrom: new Date('2023-01-01'),
        // dateTo: new Date('2023-12-31'),
      };

      await service.search(searchParams);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          title: { contains: searchParams.title, mode: 'insensitive' },
          status: searchParams.status,
          priority: searchParams.priority,
          // isActive: searchParams.isActive,
          // isDone: searchParams.isDone,
          // targetDate: {
          //   gte: searchParams.dateFrom,
          //   lte: searchParams.dateTo,
          // },
        }),
        take: searchParams.pageSize,
        skip: (searchParams.page - 1) * searchParams.pageSize,
      });
    });

    it('should search tasks with minimal parameters', async () => {
      const searchParams = {
        page: 1,
        pageSize: 10,
      };

      await service.search(searchParams);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          assignedId: undefined,
          customerId: undefined,
          id: undefined,
          isDone: false,
          priority: undefined,
          status: undefined,
          targetDate: {
            gte: undefined,
            lte: undefined,
          },
          title: {
            contains: undefined,
            mode: 'insensitive',
          },
        },
        take: searchParams.pageSize,
        skip: (searchParams.page - 1) * searchParams.pageSize,
      });
    });
  });
});
