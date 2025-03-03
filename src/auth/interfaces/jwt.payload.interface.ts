import { Roles } from '../../shared/enums/roles.enum';

export interface JwtPayload {
    id: number;
    role: Roles;
}
