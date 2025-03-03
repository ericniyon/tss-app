import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from '../../shared/interfaces/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class AuthOtp extends BaseEntity {
    @Column({ name: 'otp', nullable: false })
    otp: string;

    @Column({ name: 'otp_type', nullable: false })
    otpType: string;

    @Column({ name: 'expiration_time', nullable: false })
    expirationTime: Date;

    @Column({ name: 'sent_to', nullable: false, default: 'phone' })
    sentTo: string;

    @ManyToOne(() => User, (user: User) => user.otp)
    user: User;
}
