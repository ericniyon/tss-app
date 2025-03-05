import { Roles as UserRoles } from '../../shared/enums/roles.enum';
export declare const ROLES_KEY = "roles";
export declare const Role: (...roles: UserRoles[]) => import("@nestjs/common").CustomDecorator<string>;
