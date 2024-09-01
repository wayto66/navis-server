import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBooleanString, IsEnum, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty()
  @IsOptional()
  @IsBooleanString()
  @Type(() => Boolean)
  isDone?: boolean;

  @ApiProperty()
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
