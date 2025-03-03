import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Certificate } from '../../certificate/entities/certificate.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { EPaymentType } from '../enums/payment-type.enum';

@Entity('payments')
export class Payment extends BaseEntity {
    @Column()
    @ApiProperty()
    amount: number;
    @Column()
    @ApiProperty()
    type: EPaymentType;
    @ManyToOne(() => Certificate)
    @ApiProperty()
    certificate: Certificate;
}
