import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import BaseEntity from '../../shared/interfaces/base.entity';

@Entity('memberships')
@Index(['membershipId'], { unique: true })
export class Membership extends BaseEntity {
    @Column({ name: 'membership_id', nullable: true })
    @ApiProperty()
    membershipId: string;

    @Column({ name: 'company_name' })
    @ApiProperty()
    companyName: string;

    @Column({ name: 'membership_category' })
    @ApiProperty()
    membershipCategory: string;

    @Column({ name: 'last_name', nullable: true })
    @ApiProperty()
    lastName: string;

    @Column({ name: 'phone_number', nullable: true })
    @ApiProperty()
    phoneNumber: string;

    @Column({ nullable: true })
    @ApiProperty()
    email: string;

    @Column({ name: 'tin_numbers', nullable: true, type: 'varchar' })
    @ApiProperty()
    tinNumbers: string;

    @Column({ name: 'company_website', nullable: true })
    @ApiProperty()
    companyWebsite: string;
}

