import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBooleanString, IsEnum, IsOptional } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
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
