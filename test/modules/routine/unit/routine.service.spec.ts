import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Routine, RoutineMode } from '@prisma/client';

import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CreateRoutineDto } from 'src/modules/routine/dto/create-routine.dto';
import { SearchRoutineDto } from 'src/modules/routine/dto/search-routine.dto';
import { UpdateRoutineDto } from 'src/modules/routine/dto/update-routine.dto';
import { RoutineService } from 'src/modules/routine/routine.service';

describe('RoutineService', () => {
  let service: RoutineService;
  let prisma: PrismaService;

  const date1 = new Date();

  const sampleRoutine: Routine = {
    id: 1,
    title: 'title',
    mode: RoutineMode.DAY_COUNT,
    customerId: 1,
    creatorId: 1,
    assignedId: 1,
    description: 'description',
    createdAt: date1,
    updatedAt: date1,
    dayCount: null,
    lastSolved: null,
    monthCount: null,
    monthDays: null,
    targetDate: null,
    weekDays: null,
    yearDay: null,
    yearMonth: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutineService, PrismaService],
    }).compile();

    service = module.get<RoutineService>(RoutineService);
    prisma = module.get(PrismaService);

    jest.spyOn(prisma.routine, 'create').mockResolvedValue(sampleRoutine);
    jest.spyOn(prisma.routine, 'findUnique').mockResolvedValue(sampleRoutine);
    jest.spyOn(prisma.routine, 'findMany').mockResolvedValue([sampleRoutine]);
    jest.spyOn(prisma.routine, 'update').mockResolvedValue(sampleRoutine);
    jest.spyOn(prisma.routine, 'delete').mockResolvedValue(sampleRoutine);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a routine', async () => {
      const dto: CreateRoutineDto = {
        title: sampleRoutine.title,
        description: sampleRoutine.description,
        creatorId: sampleRoutine.creatorId,
        assignedId: sampleRoutine.assignedId,
        customerId: sampleRoutine.customerId,
        mode: sampleRoutine.mode,
        dayCount: 10,
      };

      const result = await service.create(dto);
      expect(prisma.routine.create).toHaveBeenCalledTimes(1);
      expect(prisma.routine.create).toHaveBeenCalledWith({
        data: expect.objectContaining(dto),
      });
      expect(result).toEqual(sampleRoutine);
    });

    it('should throw when using undefined weekDays creating a WEEKLY routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.WEEKLY,
        weekDays: undefined,
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when using empty weekDays creating a WEEKLY routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.WEEKLY,
        weekDays: [],
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when using undefined monthDays creating a MONTHLY routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.MONTHLY,
        monthDays: undefined,
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when using empty monthDays creating a MONTHLY routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.MONTHLY,
        monthDays: [],
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when using undefined dayCount creating a DAY_COUNT routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.DAY_COUNT,
        dayCount: undefined,
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when using 0 dayCount creating a DAY_COUNT routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.DAY_COUNT,
        dayCount: 0,
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when using undefined monthCount creating a MONTH_COUNT routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.MONTH_COUNT,
        monthCount: undefined,
        monthDays: [1, 15],
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when using 0 monthCount creating a MONTH_COUNT routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.MONTH_COUNT,
        monthCount: 0,
        monthDays: [1, 15],
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when using undefined monthDays creating a MONTH_COUNT routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.MONTH_COUNT,
        monthCount: 1,
        monthDays: undefined,
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when using empty monthDays creating a MONTH_COUNT routine', async () => {
      const dto: CreateRoutineDto = {
        ...sampleRoutine,
        mode: RoutineMode.MONTH_COUNT,
        monthCount: 1,
        monthDays: [],
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should get a routine by its id', async () => {
      const id = 1;

      const result = await service.findOne(id);
      expect(prisma.routine.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sampleRoutine);
    });
  });

  describe('search', () => {
    it('should get a routines by searchDto', async () => {
      const dto: SearchRoutineDto = {
        page: 1,
        pageSize: 15,
        customerId: 1,
        assignedId: 1,
      };

      const result = await service.search(dto);
      expect(prisma.routine.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([sampleRoutine]);
    });
  });

  describe('update', () => {
    it('should update a routine', async () => {
      const id = 1;
      const dto: UpdateRoutineDto = {
        description: 'new-description',
      };

      const result = await service.update(id, dto);
      expect(jest.spyOn(prisma.routine, 'findUnique')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(prisma.routine, 'update')).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sampleRoutine);
    });
  });

  describe('delete', () => {
    it('should delete a routine', async () => {
      const id = 1;

      const result = await service.remove(id);
      expect(prisma.routine.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.routine.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sampleRoutine);
    });
  });

  describe('check', () => {
    it('should check a routine', async () => {
      const id = 1;

      jest.spyOn(prisma.routine, 'findUnique').mockResolvedValue({
        ...sampleRoutine,
        mode: RoutineMode.DAY_COUNT,
        dayCount: 5,
      });

      const result = await service.check(id);
      expect(prisma.routine.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.routine.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sampleRoutine);
    });
  });
});
