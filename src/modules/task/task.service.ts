import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project, Task, TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { NotifyService } from '../notify/notify.service';
import { ProjectService } from '../project/project.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: NotifyService,
    private readonly projectService: ProjectService,
  ) {}

  async create({
    assignedId,
    creatorId,
    customerId,
    description,
    priority,
    title,
    createProject,
    dependsOnIds,
    projectId: input_projectId,
    targetDate,
  }: CreateTaskDto) {
    if (!createProject && !input_projectId)
      throw new BadRequestException('Must provide projectId or createProject.');

    const appUrl = process.env.NAVIS_APP_URL;
    const dependentTasksIds = dependsOnIds ? [...dependsOnIds] : [];
    const shouldNotify = creatorId !== assignedId;

    const projectId =
      input_projectId ??
      (
        await this.prisma.project.create({
          data: {
            description: description,
            title: title,
            customerId: customerId,
            userId: creatorId,
            targetDate: targetDate,
            priority: priority,
            status: targetDate
              ? TaskStatus.PENDING
              : TaskStatus.DEFINE_DEADLINE,
          },
        })
      )?.id;

    const isLocked =
      dependentTasksIds.length > 0
        ? (
            await this.prisma.task.findMany({
              where: {
                id: {
                  in: dependentTasksIds,
                },
              },
              select: {
                status: true,
              },
            })
          ).some((task) => task.status !== TaskStatus.COMPLETED)
        : false;

    const task = await this.prisma.task.create({
      data: {
        title,
        description,
        assignedId,
        customerId,
        creatorId,
        projectId,
        targetDate,
        priority,
        status: isLocked
          ? TaskStatus.LOCKED
          : targetDate
            ? TaskStatus.PENDING
            : TaskStatus.DEFINE_DEADLINE,
      },
      include: {
        assigned: shouldNotify,
        creator: shouldNotify,
      },
    });

    if (dependentTasksIds && dependentTasksIds.length > 0) {
      await this.prisma.taskDependency.createMany({
        data: dependentTasksIds.map((id) => {
          return {
            taskId: id,
            dependsOnId: task.id,
          };
        }),
      });
    }

    if (shouldNotify) {
      await this.notifier.send({
        to: task.assigned.phone,
        message: `${task.assigned.name}, ${task.creator.name} criou uma nova tarefa para você! \n\n${appUrl}/app/task?task_id=${task.id}`,
      });
    }

    return task;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
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
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (
      updateTaskDto.targetDate &&
      task.status === TaskStatus.DEFINE_DEADLINE &&
      (!updateTaskDto.status ||
        updateTaskDto.status === TaskStatus.DEFINE_DEADLINE)
    )
      updateTaskDto.status = TaskStatus.PENDING;

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        project: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (updateTaskDto.status === TaskStatus.COMPLETED)
      await this.handleTaskCompletion(updatedTask.project);

    return updatedTask;
  }

  async remove(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async search({
    customerId,
    dateFrom,
    dateTo,
    priority,
    status,
    title,
    userId,
    id,
    isDone,
    page,
    pageSize,
  }: SearchTaskDto) {
    return this.prisma.task.findMany({
      where: {
        id,
        title: {
          contains: title,
          mode: 'insensitive',
        },
        assignedId: userId,
        customerId,
        priority,
        status,
        isDone: isDone ? undefined : false,
        targetDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async handleTaskCompletion(project: Project & { tasks: Task[] }) {
    const dependentTasks = await this.prisma.task.findMany({
      where: {
        dependsOn: {
          every: {
            task: {
              status: TaskStatus.COMPLETED,
            },
          },
        },
        status: TaskStatus.LOCKED,
      },
    });

    await this.prisma.$transaction(
      dependentTasks.map((task) =>
        this.prisma.task.update({
          where: {
            id: task.id,
          },
          data: {
            status: task.targetDate
              ? TaskStatus.PENDING
              : TaskStatus.DEFINE_DEADLINE,
          },
        }),
      ),
    );

    if (project.tasks.every((task) => task.status === TaskStatus.COMPLETED)) {
      await this.prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          status: TaskStatus.COMPLETED,
        },
      });
    }
  }
}
