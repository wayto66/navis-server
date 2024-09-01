import { INestApplication } from '@nestjs/common';
import { RoutineMode } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

import * as request from 'supertest';
import { getDaysDifference } from 'test/utils/getDaysDifference';

export const checkRoutine = async (app: INestApplication) => {
  const dateNow = new Date();
  const routineId = 1;
  const response = await request(app.getHttpServer())
    .patch(`/routine/check/${routineId}`)
    .expect(200);

  expect(response.body).toHaveProperty('id');
  expect(response.body).toHaveProperty('mode');
  expect(response.body).toHaveProperty('updatedAt');
  expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(
    dateNow.getTime(),
  );
};

export const DAY_COUNTRoutineCheck = async (
  app: INestApplication,
  prisma: PrismaService,
) => {
  const todayZeroHour = new Date();
  todayZeroHour.setHours(0);
  const randomDayCount = Math.ceil(Math.random() * 10);
  const routine = await prisma.routine.create({
    data: {
      title: 'day_count',
      description: 'description',
      mode: RoutineMode.DAY_COUNT,
      targetDate: todayZeroHour,
      assignedId: 1,
      creatorId: 1,
      customerId: 1,
      dayCount: randomDayCount,
    },
  });

  const response = await request(app.getHttpServer())
    .patch(`/routine/check/${routine.id}`)
    .expect(200);

  expect(response.body).toHaveProperty('id');
  expect(response.body).toHaveProperty('mode');
  expect(response.body).toHaveProperty('targetDate');

  const newTargetDate = response.body.targetDate;
  const daysDifference = getDaysDifference(todayZeroHour, newTargetDate);
  expect(daysDifference).toEqual(randomDayCount);
};

export const WEEKLYRoutineCheck = async (
  app: INestApplication,
  prisma: PrismaService,
) => {
  const todayZeroHour = new Date();
  todayZeroHour.setHours(0, 0, 0, 0);

  const weekDays = [1, 3];
  const routine = await prisma.routine.create({
    data: {
      title: 'weekly_routine',
      description: 'description',
      mode: RoutineMode.WEEKLY,
      targetDate: todayZeroHour,
      assignedId: 1,
      creatorId: 1,
      customerId: 1,
      weekDays: weekDays,
    },
  });

  const response = await request(app.getHttpServer())
    .patch(`/routine/check/${routine.id}`)
    .expect(200);

  expect(response.body).toHaveProperty('id');
  expect(response.body).toHaveProperty('mode');
  expect(response.body).toHaveProperty('targetDate');

  const newTargetDate = new Date(response.body.targetDate);

  // Calcula a diferença de dias entre a data atual e a nova data alvo
  const todayDayOfWeek = todayZeroHour.getDay(); // 0 (Domingo) a 6 (Sábado)
  const nextRoutineDay =
    weekDays.find((day) => day > todayDayOfWeek) || weekDays[0];
  const daysUntilNextRoutine = (nextRoutineDay - todayDayOfWeek + 7) % 7;

  const expectedDaysDifference =
    daysUntilNextRoutine === 0 ? 7 : daysUntilNextRoutine;
  const daysDifference = getDaysDifference(todayZeroHour, newTargetDate);
  expect(daysDifference).toEqual(expectedDaysDifference);
};
