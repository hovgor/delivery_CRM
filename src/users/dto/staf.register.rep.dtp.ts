import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { StaffRoles } from '../../types/roles_staff';

export class stafRegisterRepDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ enum: ['driver', 'client', 'staff'] })
  @IsNotEmpty()
  @IsNumber()
  role: StaffRoles;
}
