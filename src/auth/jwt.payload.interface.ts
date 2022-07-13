import { UserRoles } from '../types/roles';

export interface IJwtPayload {
  email: string;
  role: UserRoles;
  sub: string;
  iat: number;
  exp: number;
}
