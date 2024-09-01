import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchRoutineDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  creatorId?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  assignedId?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  customerId?: number;

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
