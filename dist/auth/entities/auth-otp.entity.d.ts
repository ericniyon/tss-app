import BaseEntity from '../../shared/interfaces/base.entity';
import { User } from '../../users/entities/user.entity';
export declare class AuthOtp extends BaseEntity {
    otp: string;
    otpType: string;
    expirationTime: Date;
    sentTo: string;
    user: User;
}
