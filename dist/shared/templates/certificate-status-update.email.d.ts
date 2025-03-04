import { ECertificateStatus } from '../../certificate/enums';
import { User } from '../../users/entities/user.entity';
export declare const CertificateStatusUpdateEmailTemplate: (applicant: User, status: ECertificateStatus, msg: string, webUrl: string) => string;
