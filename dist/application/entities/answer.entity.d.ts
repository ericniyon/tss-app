import { Question } from '../../question/entities/question.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { EAnswerStatus } from '../enums';
import { Application } from './application.entity';
export declare class Answer extends BaseEntity {
    questionText: string;
    attachments: string[];
    responses: string[];
    status: EAnswerStatus;
    feedback: string;
    application: Application;
    question: Question;
}
