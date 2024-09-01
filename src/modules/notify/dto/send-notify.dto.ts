import { IsNotEmpty, IsString } from 'class-validator';

export class SendNotifyDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
