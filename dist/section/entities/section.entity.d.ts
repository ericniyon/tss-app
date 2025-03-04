import { Question } from '../../question/entities/question.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
export declare class Section extends BaseEntity {
    title: string;
    tips: string;
    active: boolean;
    readonly: boolean;
    questions: Question[];
    sectionCategory: number;
}
