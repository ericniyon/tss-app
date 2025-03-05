export declare class CreateAnswerDto {
    questionId: number;
    attachments?: string[];
    responses: string[];
}
export declare class CreateOrUpdateAnswersDto {
    sectionId: number;
    answers: CreateAnswerDto[];
}
