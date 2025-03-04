import { Application } from '../../application/entities/application.entity';
import { ECertificateStatus } from '../enums';
export declare class CertificateResponseDto {
    uniqueId: string;
    status: ECertificateStatus;
    application: Application;
    expirationDate: Date;
    isValid: boolean;
}
