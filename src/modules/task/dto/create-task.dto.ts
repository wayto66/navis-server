import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  targetDate?: Date;

  @ApiProperty()
  @IsInt()
  creatorId: number;

  @ApiProperty()
  @IsInt()
  assignedId: number;

  @ApiProperty()
  @IsInt()
  @ValidateIf((dto: CreateTaskDto) => !dto.createProject)
  projectId?: number;

  @ApiProperty()
  @IsBoolean()
  @ValidateIf((dto: CreateTaskDto) => !dto.projectId)
  createProject?: boolean;

  @ApiProperty()
  @IsInt()
  customerId: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsInt({
    each: true,
  })
  dependsOnIds?: number[];
}
