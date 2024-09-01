import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl({}, { message: 'URL da imagem deve ser um URL válido.' })
  readonly image?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
