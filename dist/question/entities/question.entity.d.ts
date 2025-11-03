import { Category } from '../../category/entities/category.entity';
import { Section } from '../../section/entities/section.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { EType } from '../enums';
import { Subsection } from 'src/subsection/entities/subsection.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
export declare class Question extends BaseEntity {
    text: string;
    type: EType;
    requiresAttachments: boolean;
    active: boolean;
    possibleAnswers: string[];
    hasBeenAsked: boolean;
    section: Section;
    categories: Category[];
    subsection: Subsection;
    subcategory: Subcategory;
}
