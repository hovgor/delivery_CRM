import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { string } from 'joi';

export class ClientCreteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ required: false, format: 'binary' })
  logo?: any;

  @ApiPropertyOptional()
  @IsString()
  branches: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;
}
