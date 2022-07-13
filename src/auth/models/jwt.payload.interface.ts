import { UserRoles } from '../../types/roles';

export interface IJwtPayload {
  id: string;
  role: UserRoles;
}
