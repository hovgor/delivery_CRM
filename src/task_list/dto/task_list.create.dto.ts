import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TaskListCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
