import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class SearchNoteDto {
  @ApiProperty()
  @Type(() => Number)
  userId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  pageSize: number;
}
