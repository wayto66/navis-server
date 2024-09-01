import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { AppController } from 'src/modules/app/app.controller';
import { AppService } from 'src/modules/app/app.service';
import { AppModule } from '../../../../src/modules/app/app.module';
import { createTask } from './task.create';
import { taskDelete } from './task.delete';
import { taskFindOne, taskFindOne404 } from './task.find-one';
import { taskSearch } from './task.search';
import { taskUpdate } from './task.update';

describe('Task E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            transform: true,
            whitelist: true,
          }),
        },
      ],
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /task', () => {
    it('should create a new task', () => createTask(app));
  });

  describe('GET /task/:id', () => {
    it('should find a task by id', () => taskFindOne(app, prisma));
    it('should return 404 when not founding a task', () => taskFindOne404(app));
  });

  describe('PATCH /task/:id', () => {
    it('should update a task', () => taskUpdate(app, prisma));
  });

  describe('DELETE /task/:id', () => {
    it('should delete a task', () => taskDelete(app, prisma));
  });

  describe('GET /task', () => {
    it('should search and return tasks', () => taskSearch(app, prisma));
  });
});
