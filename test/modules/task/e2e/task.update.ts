import { INestApplication } from '@nestjs/common';
import { TaskPriority } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import * as request from 'supertest';

export const taskUpdate = async (
  app: INestApplication,
  prisma: PrismaService,
) => {
  // First, create a task
  const createTaskDto = {
    title: 'Task to Update',
    description: 'This task will be updated',
    priority: TaskPriority.LOW,
    customerId: 1,
    assignedId: 1,
    creatorId: 1,
    projectId: 1,
  };

  const createdTask = await prisma.task.create({ data: createTaskDto });

  const updateTaskDto = {
    title: 'Updated Task Title',
    priority: TaskPriority.HIGH,
  };

  const response = await request(app.getHttpServer())
    .patch(`/task/${createdTask.id}`)
    .send(updateTaskDto)
    .expect(200);

  expect(response.body.title).toBe(updateTaskDto.title);
  expect(response.body.priority).toBe(updateTaskDto.priority);
};
