import { INestApplication } from '@nestjs/common';
import { RoutineMode } from '@prisma/client';
import { CreateRoutineDto } from 'src/modules/routine/dto/create-routine.dto';

import * as request from 'supertest';

const createRoutineDto = (
  mode: RoutineMode,
  additionalProps: Partial<CreateRoutineDto> = {},
): CreateRoutineDto => ({
  title: 'Test Routine',
  description: 'This is a test routine',
  customerId: 1,
  creatorId: 1,
  assignedId: 1,
  targetDate: new Date(),
  mode,
  ...additionalProps,
});

const expectBadRequest = async (
  app: INestApplication,
  dto: CreateRoutineDto,
) => {
  await request(app.getHttpServer()).post('/routine').send(dto).expect(400); // Expect 400 Bad Request
};

export const createRoutine = async (app: INestApplication) => {
  const createRoutineDto: CreateRoutineDto = {
    title: 'Test Routine',
    description: 'This is a test routine',
    customerId: 1,
    creatorId: 1,
    assignedId: 1,
    targetDate: new Date(),
    mode: RoutineMode.DAY_COUNT,
    dayCount: 5,
  };

  const response = await request(app.getHttpServer())
    .post('/routine')
    .send(createRoutineDto)
    .expect(201);

  expect(response.body).toHaveProperty('id');
  expect(response.body.title).toBe(createRoutineDto.title);
  expect(response.body.mode).toBe(RoutineMode.DAY_COUNT);
};

export const weeklyRoutineWithUndefinedWeekdays = async (
  app: INestApplication,
) => {
  const dto = createRoutineDto(RoutineMode.WEEKLY, {
    weekDays: undefined,
  });
  await expectBadRequest(app, dto);
};

export const weeklyRoutineWithEmptyWeekdays = async (app: INestApplication) => {
  const dto = createRoutineDto(RoutineMode.WEEKLY, {
    weekDays: [],
  });
  await expectBadRequest(app, dto);
};

export const monthlyRoutineWithUndefinedMonthDays = async (
  app: INestApplication,
) => {
  const dto = createRoutineDto(RoutineMode.MONTHLY, {
    monthDays: undefined,
  });
  await expectBadRequest(app, dto);
};

export const monthlyRoutineWithEmptyMonthDays = async (
  app: INestApplication,
) => {
  const dto = createRoutineDto(RoutineMode.MONTHLY, {
    monthDays: [],
  });
  await expectBadRequest(app, dto);
};

export const dayCountRoutineWithUndefinedDaycount = async (
  app: INestApplication,
) => {
  const dto = createRoutineDto(RoutineMode.DAY_COUNT, {
    dayCount: undefined,
  });
  await expectBadRequest(app, dto);
};

export const dayCountRoutineWithEmptyDaycount = async (
  app: INestApplication,
) => {
  const dto = createRoutineDto(RoutineMode.DAY_COUNT, {
    dayCount: 0,
  });
  await expectBadRequest(app, dto);
};
