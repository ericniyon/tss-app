import { Application } from '../../application/entities/application.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { User } from '../../users/entities/user.entity';
import { ECertificateStatus } from '../enums';
export declare class Certificate extends BaseEntity {
    uniqueId: string;
    status: ECertificateStatus;
    application: Application;
    assignees: User[];
    expirationDate: Date;
    grantedAt: Date;
    isRenewing: boolean;
    isValid: () => boolean;
    isExpired: () => boolean;
}
