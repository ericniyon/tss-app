import { Answer } from '../entities/answer.entity';
import { Application } from '../entities/application.entity';
export interface IApplication extends Application {
    sections: {
        id: number;
        title: string;
        tips: string;
        answers: Answer[];
    }[];
}
