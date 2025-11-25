import { Answer } from '../entities/answer.entity';
import { Application } from '../entities/application.entity';
import { EAnswerStatus } from '../enums';
import { EType } from '../../question/enums';

export interface IApplication extends Application {
    sections: {
        id: number;
        title: string;
        tips: string;
        answers: Answer[];
    }[];
}

export interface IEditableApplication extends Application {
    sections: {
        id: number;
        title: string;
        tips?: string;
        questions: {
            id: number;
            text: string;
            type: EType;
            requiresAttachments: boolean;
            possibleAnswers?: string[];
            answer?: {
                id: number | null;
                responses: string[];
                attachments: string[];
                status?: EAnswerStatus | null;
                feedback?: string | null;
            };
        }[];
    }[];
}

