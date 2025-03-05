import { Category } from '../../category/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Answer } from '../entities/answer.entity';
import { EApplicationStatus } from '../enums';
export declare class ApplicationResponseDto {
    companyUrl: string;
    feedback: string;
    status: EApplicationStatus;
    applicant: User;
    assignees: User[];
    category: Category;
    completed: boolean;
    submittedAt: Date;
    sections: {
        title: string;
        tips: string;
        answers: Answer[];
    }[];
}
