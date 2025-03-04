import { EAnswerStatus } from '../enums';
export declare class UpdateAnswerStatusDto {
    id: number;
    status: EAnswerStatus;
    feedback: string;
}
export declare class ReviewAnswersDto {
    answers: UpdateAnswerStatusDto[];
}
