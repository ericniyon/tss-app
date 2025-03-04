import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionFilterOptionsDto } from './dto/question-filter-options.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    create(createQuestionDto: CreateQuestionDto): Promise<GenericResponse<Question>>;
    findAll(options: IPagination, filterOptions: QuestionFilterOptionsDto, user: User): Promise<GenericResponse<IPage<Question>>>;
    findOne(id: string): Promise<GenericResponse<Question>>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<GenericResponse<Question>>;
    remove(id: string): Promise<GenericResponse<void>>;
    addCategory(id: string, categoryId: string): Promise<GenericResponse<void>>;
    removeCategory(id: string, categoryId: string): Promise<GenericResponse<void>>;
    toggleActive(id: string): Promise<GenericResponse<void>>;
}
