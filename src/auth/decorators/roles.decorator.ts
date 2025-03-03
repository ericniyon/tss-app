import { SetMetadata } from '@nestjs/common';
import { Roles as UserRoles } from '../../shared/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Role = (...roles: UserRoles[]) => SetMetadata('roles', roles);
