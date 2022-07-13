import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { StaffRoles } from '../../types/roles_staff';

export class GetUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ enum: ['driver', 'client', 'staff'] })
  @IsNumber()
  role: StaffRoles;
}
