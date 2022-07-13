import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../types/roles';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
