import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AppCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  start_address: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  end_address: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  due_date: string;

  @ApiProperty()
  attachment?: any[];
}
