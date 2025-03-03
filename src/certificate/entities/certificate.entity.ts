import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
} from 'typeorm';
import { Application } from '../../application/entities/application.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { User } from '../../users/entities/user.entity';
import { ECertificateStatus } from '../enums';

@Entity('certificates')
export class Certificate extends BaseEntity {
    @Column({ nullable: false })
    uniqueId: string;

    @Column({ default: ECertificateStatus.PENDING_PAYMENT })
    @Transform(({ value }) => value?.replace(/_/g, ' '))
    status: ECertificateStatus;

    @OneToOne(() => Application, (application) => application.certificate)
    @ApiProperty({ type: () => Application })
    @JoinColumn()
    application: Application;

    @ManyToMany(() => User)
    @JoinTable()
    assignees: User[];

    @Column({ nullable: true })
    @ApiProperty()
    expirationDate: Date;

    @Column({ nullable: true })
    @ApiProperty()
    grantedAt: Date;

    @Column({ default: false })
    @ApiProperty()
    isRenewing: boolean;

    isValid = (): boolean =>
        this.status === ECertificateStatus.GRANTED &&
        !(this.expirationDate !== null && this.expirationDate < new Date());

    isExpired = (): boolean =>
        this.expirationDate !== null && this.expirationDate < new Date();
}
