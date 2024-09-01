import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsInt()
  @ValidateIf((dto: CreateCommentDto) => !dto.projectId)
  taskId?: number;

  @ApiProperty()
  @IsInt()
  @ValidateIf((dto: CreateCommentDto) => !dto.taskId)
  projectId?: number;

  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
