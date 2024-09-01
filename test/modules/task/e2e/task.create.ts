import { INestApplication } from '@nestjs/common';
import { TaskPriority, TaskStatus } from '@prisma/client';
import * as request from 'supertest';

export const createTask = async (app: INestApplication) => {
  const createTaskDto = {
    title: 'Test Task',
    description: 'This is a test task',
    priority: TaskPriority.MEDIUM,
    customerId: 1,
    assignedId: 1,
    creatorId: 1,
    projectId: 1,
    targetDate: new Date().toISOString(),
  };

  const response = await request(app.getHttpServer())
    .post('/task')
    .send(createTaskDto)
    .expect(201);

  expect(response.body).toHaveProperty('id');
  expect(response.body.title).toBe(createTaskDto.title);
  expect(response.body.status).toBe(TaskStatus.PENDING);
};
