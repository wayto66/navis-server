import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Routine, RoutineMode } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { SearchRoutineDto } from './dto/search-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutineService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateRoutineDto) {
    const { mode, weekDays, monthDays, monthCount, dayCount } = dto;
    if (mode === RoutineMode.WEEKLY && (!weekDays || weekDays.length === 0))
      throw new BadRequestException('WEEKLY routines should provide weekDays.');

    if (mode === RoutineMode.MONTHLY && (!monthDays || monthDays.length === 0))
      throw new BadRequestException(
        'MONTHLY routines should provide monthDays.',
      );

    if (mode === RoutineMode.DAY_COUNT && (!dayCount || dayCount === 0))
      throw new BadRequestException(
        'DAY_COUNT routines should provide dayCount greater than 0.',
      );

    if (
      mode === RoutineMode.MONTH_COUNT &&
      (!monthCount || monthCount === 0 || !monthDays || monthDays.length === 0)
    )
      throw new BadRequestException(
        'MONTH_COUNT routines should provide monthCount greater than 0, and monthDays.',
      );

    const targetDate = dto.targetDate ?? new Date();

    return this.prisma.routine.create({
      data: {
        ...dto,
        targetDate,
      },
    });
  }

  async search({
    page,
    pageSize,
    customerId,
    dateFrom,
    dateTo,
    title,
    creatorId,
    assignedId,
  }: SearchRoutineDto) {
    return await this.prisma.routine.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
        customerId,
        creatorId,
        assignedId,
        targetDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async findOne(id: number) {
    const routine = await this.prisma.routine.findUnique({
      where: {
        id,
      },
    });
    if (!routine)
      throw new NotFoundException(`Routine with id ${id} not found.`);

    return routine;
  }

  async update(
    id: number,
    { description, lastSolved, title }: UpdateRoutineDto,
  ) {
    const routine = await this.prisma.routine.findUnique({
      where: {
        id,
      },
    });
    if (!routine)
      throw new NotFoundException(`Routine with id ${id} not found.`);
    return await this.prisma.routine.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        lastSolved,
      },
    });
  }

  async check(id: number) {
    const routine = await this.prisma.routine.findUnique({
      where: {
        id,
      },
    });
    if (!routine)
      throw new NotFoundException(`Routine with id ${id} not found.`);

    const newTargetDate = this.getNextRoutineDate(routine);

    return await this.prisma.routine.update({
      where: {
        id,
      },
      data: {
        targetDate: newTargetDate,
      },
    });
  }

  async remove(id: number) {
    const routine = await this.prisma.routine.findUnique({
      where: {
        id,
      },
    });
    if (!routine)
      throw new NotFoundException(`Routine with id ${id} not found.`);

    return await this.prisma.routine.delete({
      where: {
        id,
      },
    });
  }

  getNextRoutineDate = (routine: Routine): Date => {
    const today = new Date();
    const nextDate = new Date(today); // Clone of today to avoid mutating the original date

    switch (routine.mode) {
      case RoutineMode.DAY_COUNT:
        if (!routine.dayCount || routine.dayCount === 0) {
          throw new InternalServerErrorException(
            'No daycount for DAY_COUNT routine',
          );
        }
        nextDate.setDate(today.getDate() + routine.dayCount);
        break;

      case RoutineMode.WEEKLY:
        const todayDayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        const nextRoutineDay =
          routine.weekDays.find((day) => day > todayDayOfWeek) ||
          routine.weekDays[0];
        const daysUntilNextRoutine = (nextRoutineDay - todayDayOfWeek + 7) % 7;
        if (daysUntilNextRoutine === 0) {
          nextDate.setDate(today.getDate() + 7);
        } else {
          nextDate.setDate(today.getDate() + daysUntilNextRoutine);
        }
        break;

      case RoutineMode.MONTHLY:
        const nextMonthDay =
          routine.monthDays.find((day) => day > today.getDate()) ||
          routine.monthDays[0];
        if (nextMonthDay === undefined) {
          nextDate.setMonth(today.getMonth() + 1);
          nextDate.setDate(routine.monthDays[0]);
        } else {
          nextDate.setDate(nextMonthDay);
        }
        break;

      case RoutineMode.MONTH_COUNT:
        if (!routine.monthCount || routine.monthCount === 0) {
          throw new InternalServerErrorException(
            'No monthcount for MONTH_COUNT routine',
          );
        }
        nextDate.setMonth(today.getMonth() + routine.monthCount);
        break;

      default:
        throw new InternalServerErrorException('Unknown routine mode');
    }

    return nextDate;
  };
}
