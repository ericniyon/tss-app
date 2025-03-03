import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { AuthOtp } from '../../auth/entities/auth-otp.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { Roles } from '../../shared/enums/roles.enum';
import BaseEntity from '../../shared/interfaces/base.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ unique: true, nullable: false })
    @ApiProperty()
    email: string;

    @Column({ nullable: false })
    @Exclude()
    password?: string;

    @Column({ nullable: true })
    @Exclude()
    refreshToken: string;

    @Column({ name: 'name' })
    @ApiProperty()
    name: string;

    @Column({ name: 'phone', unique: true, nullable: true })
    @ApiProperty()
    phone: string;

    @Column({ default: false, nullable: true })
    @ApiProperty()
    verified: boolean;

    @Column({ name: 'activated', default: true, nullable: false })
    @ApiProperty()
    activated: boolean;

    @Column({ default: Roles.COMPANY, nullable: false })
    @Transform(({ value }) => value?.replace(/_/g, ' '))
    @ApiProperty()
    role: Roles;

    @OneToMany(() => AuthOtp, (otp: AuthOtp) => otp.user)
    public otp: AuthOtp[];

    @ManyToMany(
        () => Notification,
        (notification) => notification.targetUsers,
        { lazy: true },
    )
    notifications: Notification[];
}
