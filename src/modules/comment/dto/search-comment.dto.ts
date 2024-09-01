import { ApiProperty } from '@nestjs/swagger';
import { IsInt, ValidateIf } from 'class-validator';

export class SearchCommentDto {
  @ApiProperty()
  @IsInt()
  @ValidateIf((dto: SearchCommentDto) => !dto.projectId)
  taskId?: number;

  @ApiProperty()
  @IsInt()
  @ValidateIf((dto: SearchCommentDto) => !dto.taskId)
  projectId?: number;
}
