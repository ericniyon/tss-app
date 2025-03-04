import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { Section } from '../section/entities/section.entity';
import { Roles } from '../shared/enums/roles.enum';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionFilterOptionsDto } from './dto/question-filter-options.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
export declare class QuestionService {
    private readonly questionRepo;
    private readonly sectionRepo;
    private readonly categoryRepo;
    constructor(questionRepo: Repository<Question>, sectionRepo: Repository<Section>, categoryRepo: Repository<Category>);
    create(createQuestionDto: CreateQuestionDto): Promise<Question>;
    findAll(options: IPagination, role: Roles, { sort, ...filterOptions }: QuestionFilterOptionsDto): Promise<IPage<Question>>;
    findOne(id: number): Promise<Question>;
    update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question>;
    addCategory(id: number, categoryId: number): Promise<void>;
    removeCategory(id: number, categoryId: number): Promise<void>;
    remove(id: number): Promise<void>;
    toggleActive(id: number): Promise<boolean>;
}
