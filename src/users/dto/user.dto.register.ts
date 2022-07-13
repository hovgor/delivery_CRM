import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRoles } from '../../types/roles';

export class UserRegisterDto {
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

  @ApiProperty({ enum: ['driver', 'superAdmin', 'client', 'staff'] })
  @IsNotEmpty()
  @IsNumber()
  role: UserRoles;
}
