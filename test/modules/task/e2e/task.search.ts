import { INestApplication } from '@nestjs/common';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { SearchProjectDto } from 'src/modules/project/dto/search-project.dto';
import * as request from 'supertest';

export const taskSearch = async (
  app: INestApplication,
  prisma: PrismaService,
) => {
  // Create some tasks for searching
  await prisma.task.createMany({
    data: [
      {
        title: 'Search Task 1',
        description: 'Task for search test',
        priority: TaskPriority.HIGH,
        status: TaskStatus.PENDING,
        customerId: 1,
        assignedId: 1,
        creatorId: 1,
        projectId: 1,
      },
      {
        title: 'Search Task 2',
        description: 'Another task for search test',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.IN_PROGRESS,
        customerId: 1,
        assignedId: 1,
        creatorId: 1,
        projectId: 1,
      },
    ],
  });

  const dto: SearchProjectDto = {
    title: 'Search',
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    page: 1,
    pageSize: 15,
  };

  const response = await request(app.getHttpServer())
    .get('/task')
    .query(dto)
    .expect(200);

  expect(response.body).toHaveLength(1);
  expect(response.body[0].title).toBe('Search Task 1');
};
