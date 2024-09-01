import { INestApplication } from '@nestjs/common';
import { TaskPriority } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import * as request from 'supertest';

export const taskFindOne = async (
  app: INestApplication,
  prisma: PrismaService,
) => {
  // First, create a task
  const createTaskDto = {
    title: 'Task to Fetch',
    description: 'This task will be fetched',
    priority: TaskPriority.HIGH,
    customerId: 1,
    assignedId: 1,
    creatorId: 1,
    projectId: 1,
  };

  const createdTask = await prisma.task.create({ data: createTaskDto });

  const response = await request(app.getHttpServer())
    .get(`/task/${createdTask.id}`)
    .expect(200);

  expect(response.body.id).toBe(createdTask.id);
  expect(response.body.title).toBe(createdTask.title);
};

export const taskFindOne404 = async (app: INestApplication) => {
  await request(app.getHttpServer()).get('/task/999999').expect(404);
};
