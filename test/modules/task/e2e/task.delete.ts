import { INestApplication } from '@nestjs/common';
import { TaskPriority } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import * as request from 'supertest';

export const taskDelete = async (
  app: INestApplication,
  prisma: PrismaService,
) => {
  {
    // First, create a task
    const createTaskDto = {
      title: 'Task to Delete',
      description: 'This task will be deleted',
      priority: TaskPriority.MEDIUM,
      customerId: 1,
      assignedId: 1,
      creatorId: 1,
      projectId: 1,
    };

    const createdTask = await prisma.task.create({ data: createTaskDto });

    await request(app.getHttpServer())
      .delete(`/task/${createdTask.id}`)
      .expect(200);

    // Verify the task is deleted
    const deletedTask = await prisma.task.findUnique({
      where: { id: createdTask.id },
    });
    expect(deletedTask).toBeNull();
  }
};
