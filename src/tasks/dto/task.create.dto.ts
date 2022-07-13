import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TaskCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  status: number;

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

  @ApiPropertyOptional({ required: false, format: 'binary' })
  attachment?: any[];
}
