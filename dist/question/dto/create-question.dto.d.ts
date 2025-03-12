import { EType } from '../enums';
export declare class CreateQuestionDto {
    text: string;
    type: EType;
    requiresAttachments: boolean;
    possibleAnswers: string[];
    sectionId: number;
    categoryIds: number[];
    subsectionId: number;
    subcategoryId: number;
}
