import { AuthOtp } from '../../auth/entities/auth-otp.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { Roles } from '../../shared/enums/roles.enum';
import BaseEntity from '../../shared/interfaces/base.entity';
export declare class User extends BaseEntity {
    email: string;
    password?: string;
    refreshToken: string;
    name: string;
    phone: string;
    verified: boolean;
    activated: boolean;
    role: Roles;
    otp: AuthOtp[];
    notifications: Notification[];
    applications: any;
}
