import { EApplicationStatus } from '../enums';
export declare class UpdateApplicationStatusDto {
    status: Exclude<EApplicationStatus, EApplicationStatus.SUBMITTED | EApplicationStatus.PENDING>;
    setupFee: number;
    subscriptionFee: number;
}
