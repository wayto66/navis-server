import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { AppController } from 'src/modules/app/app.controller';
import { AppModule } from 'src/modules/app/app.module';
import { AppService } from 'src/modules/app/app.service';

import { checkRoutine, DAY_COUNTRoutineCheck } from './routine.check.ts';
import {
  createRoutine,
  dayCountRoutineWithEmptyDaycount,
  dayCountRoutineWithUndefinedDaycount,
  monthlyRoutineWithEmptyMonthDays,
  monthlyRoutineWithUndefinedMonthDays,
  weeklyRoutineWithEmptyWeekdays,
  weeklyRoutineWithUndefinedWeekdays,
} from './routine.create';

describe('RoutineE2E', () => {
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

    prisma = app.get(PrismaService);
  });

  afterAll(async () => await app.close());

  describe('POST /', () => {
    it('should create a routine', () => createRoutine(app));
    it('should throw when using undefined weekDays creating a WEEKLY routine', () =>
      weeklyRoutineWithUndefinedWeekdays(app));
    it('should throw when using empty weekDays creating a WEEKLY routine', () =>
      weeklyRoutineWithEmptyWeekdays(app));
    it('should throw when using undefined monthDays creating a MONTHLY routine', () =>
      monthlyRoutineWithUndefinedMonthDays(app));
    it('should throw when using empty monthDays creating a MONTHLY routine', () =>
      monthlyRoutineWithEmptyMonthDays(app));
    it('should throw when using undefined dayCount creating a DAY_COUNT routine', () =>
      dayCountRoutineWithUndefinedDaycount(app));
    it('should throw when using zero dayCount creating a DAY_COUNT routine', () =>
      dayCountRoutineWithEmptyDaycount(app));
  });

  describe('PATCH /check', () => {
    it('should check a routine', () => checkRoutine(app));
    it('should update targetDate on DAY_COUNT routine', () =>
      DAY_COUNTRoutineCheck(app, prisma));
  });
});
