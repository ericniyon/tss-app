import { EApplicationStatus } from '../../application/enums';
import { User } from '../../users/entities/user.entity';
export declare const ApplicationStatusUpdateEmailTemplate: (applicant: User, status: EApplicationStatus, category: string, msg: string) => string;
