import { ECertificateStatus } from '../enums';
export declare class UpdateCertificateStatusDto {
    status: ECertificateStatus;
    certificates?: number[];
}
