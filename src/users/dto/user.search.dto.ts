import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GetUser } from '../../types/get.user';

export class UserSearchDto {
  @ApiPropertyOptional({ required: false })
  id: number;

  @ApiProperty({ required: false })
  name: string;

  @ApiPropertyOptional({ required: false })
  email: string;
}
