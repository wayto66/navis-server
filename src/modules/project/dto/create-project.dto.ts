import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
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
  userId: number;

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
