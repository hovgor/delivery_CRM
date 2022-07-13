import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ required: true })
  status: number;
}
