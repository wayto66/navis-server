import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { SearchProjectDto } from './dto/search-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProjectDto: CreateProjectDto) {
    return await this.prisma.project.create({
      data: {
        ...createProjectDto,
        status: createProjectDto.targetDate
          ? TaskStatus.PENDING
          : TaskStatus.DEFINE_DEADLINE,
      },
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
  }: SearchProjectDto) {
    return this.prisma.project.findMany({
      where: {
        id,
        title: {
          contains: title,
          mode: 'insensitive',
        },
        userId,
        customerId,
        priority,
        status,
        isDone: isDone ? undefined : false,
        targetDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
        comments: true,
      },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`project with ID ${id} not found`);
    }
    if (
      updateProjectDto.targetDate &&
      project.status === TaskStatus.DEFINE_DEADLINE &&
      (!updateProjectDto.status ||
        updateProjectDto.status === TaskStatus.DEFINE_DEADLINE)
    )
      updateProjectDto.status = TaskStatus.PENDING;
    return await this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    });
  }

  async remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
