import { IsEmail, IsInt, IsString } from 'class-validator';

export class UserResDataDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  phone: number;

  @IsEmail()
  email: string;
}
