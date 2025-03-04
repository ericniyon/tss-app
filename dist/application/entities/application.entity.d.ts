import { Certificate } from '../../certificate/entities/certificate.entity';
import { Category } from '../../category/entities/category.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { User } from '../../users/entities/user.entity';
import { EApplicationStatus, EPlatform } from '../enums';
import { Answer } from './answer.entity';
export declare class Application extends BaseEntity {
    companyUrl: string;
    status: EApplicationStatus;
    answers: Answer[];
    applicant: User;
    assignees: User[];
    category: Category;
    completed: boolean;
    businessPlatform: EPlatform;
    setupFee: number;
    subscriptionFee: number;
    submittedAt: Date;
    certificate: Certificate;
}
