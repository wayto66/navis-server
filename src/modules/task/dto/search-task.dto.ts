import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchTaskDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDone?: boolean;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  customerId?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  pageSize: number;
}
