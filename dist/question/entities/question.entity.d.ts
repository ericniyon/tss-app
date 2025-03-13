import { Category } from '../../category/entities/category.entity';
import { Section } from '../../section/entities/section.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { EType } from '../enums';
export declare class Question extends BaseEntity {
    text: string;
    type: EType;
    requiresAttachments: boolean;
    active: boolean;
    possibleAnswers: string[];
    hasBeenAsked: boolean;
    section: Section;
    categories: Category[];
    subsection: number;
    subcategory: number;
    answers: any;
}
