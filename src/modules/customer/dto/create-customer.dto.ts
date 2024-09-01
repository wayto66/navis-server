import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O nome do customer não pode estar vazio.' })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl({}, { message: 'Por favor, forneça um endereço de email válido.' })
  image?: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('BR', {
    message:
      'Por favor, forneça um número de telefone válido com o código do país (ex: +55 para Brasil).',
  })
  phone?: string;
}
