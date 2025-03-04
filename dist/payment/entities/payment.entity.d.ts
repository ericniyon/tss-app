import { Certificate } from '../../certificate/entities/certificate.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { EPaymentType } from '../enums/payment-type.enum';
export declare class Payment extends BaseEntity {
    amount: number;
    type: EPaymentType;
    certificate: Certificate;
}
