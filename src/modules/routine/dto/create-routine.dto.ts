import { ApiProperty } from '@nestjs/swagger';
import { RoutineMode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoutineDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: RoutineMode })
  @IsEnum(RoutineMode)
  mode: RoutineMode;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  dayCount?: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  weekDays?: number[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  monthDays?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  yearDay?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  yearMonth?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  monthCount?: number;

  @ApiProperty()
  @IsInt()
  creatorId: number;

  @ApiProperty()
  @IsInt()
  assignedId: number;

  @ApiProperty()
  @IsInt()
  customerId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastSolved?: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  targetDate?: Date;
}
