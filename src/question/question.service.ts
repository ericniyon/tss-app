import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as pick from 'lodash.pick';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { Section } from '../section/entities/section.entity';
import { Roles } from '../shared/enums/roles.enum';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { getActualDateRange } from '../shared/utils/date.util';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionFilterOptionsDto } from './dto/question-filter-options.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { EStatus, EType } from './enums';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Subsection } from 'src/subsection/entities/subsection.entity';

/**
 * @Service question operations
 */
@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private readonly questionRepo: Repository<Question>,
        @InjectRepository(Section)
        private readonly sectionRepo: Repository<Section>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Subsection)
        private readonly subsectionRepo: Repository<Subsection>,
        @InjectRepository(Subcategory)
        private readonly subcategoryRepo: Repository<Subcategory>,
    ) {}
    async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
        let newQuestion = new Question();
        newQuestion = {
            ...newQuestion,
            ...pick(createQuestionDto, ['text', 'requiresAttachments', 'type']),
        };
        Logger.log(newQuestion);
        if (createQuestionDto.sectionId) {
            const section = await this.sectionRepo.findOne({
                id: createQuestionDto.sectionId,
                active: true,
            });
            if (!section)
                throw new NotFoundException('Section not found or not active');
            newQuestion.section = section;
        }

        const promises = createQuestionDto.categoryIds.map((id) =>
            this.categoryRepo.findOne({ id, active: true }),
        );
        newQuestion.categories = (await Promise.all(promises))
            .map((c) => c)
            .filter((c) => c);
        if (
            createQuestionDto.possibleAnswers &&
            newQuestion.type !== EType.MULTIPLE_CHOICE &&
            newQuestion.type !== EType.SINGLE_CHOICE
        ) {
            throw new BadRequestException(
                'You cannot only set custom possible answers for multiple suggestion questions',
            );
        }
        if (
            !createQuestionDto.possibleAnswers &&
            (newQuestion.type === EType.MULTIPLE_CHOICE ||
                newQuestion.type === EType.SINGLE_CHOICE)
        )
            throw new BadRequestException(
                'Possible answers are required for multiple suggestion questions',
            );
        newQuestion.possibleAnswers = createQuestionDto.possibleAnswers;

        if (createQuestionDto.subsectionId) {
            const subsection = await this.subsectionRepo.findOne({
                id: createQuestionDto.subsectionId,
            });
            if (!subsection)
                throw new NotFoundException(
                    'Subsection not found or not active',
                );
            newQuestion.subsectionId = subsection.id;
        }

        if (createQuestionDto.subcategoryId) {
            const subcategory = await this.subcategoryRepo.findOne({
                id: createQuestionDto.subcategoryId,
            });
            if (!subcategory)
                throw new NotFoundException(
                    'Subcategory not found or not active',
                );
            newQuestion.subcategoryId = subcategory.id;
        }

        return await this.questionRepo.save(newQuestion);
    }

    async findAll(
        options: IPagination,
        role: Roles,
        { sort, ...filterOptions }: QuestionFilterOptionsDto,
    ): Promise<IPage<Question>> {
        let { status } = filterOptions;
        if (!status && ![Roles.DBI_ADMIN, Roles.DBI_EXPERT].includes(role)) {
            status = EStatus.ACTIVE;
        }
        const queryBuilder = this.questionRepo.createQueryBuilder('question');
        queryBuilder
            .leftJoin('question.section', 'section')
            .leftJoin('question.categories', 'categories')
            .leftJoin('question.subsection', 'subsection')
            .leftJoin('question.subcategory', 'subcategory')
            .addSelect([
                'section.id',
                'section.title',
                'categories.id',
                'categories.name',
                'subsection.id',
                'subsection.name',
                'subcategory.id',
                'subcategory.name',
            ]);
        const { actualStartDate, actualEndDate } = getActualDateRange(
            filterOptions.dateFrom,
            filterOptions.dateTo,
        );
        if (actualStartDate) {
            queryBuilder.andWhere(
                'question.createdAt BETWEEN :actualStartDate AND :actualEndDate',
                {
                    actualStartDate,
                    actualEndDate,
                },
            );
        }

        if (status) {
            if (status == EStatus.ACTIVE)
                queryBuilder.where('question.active = :active', {
                    active: true,
                });
            if (status == EStatus.INACTIVE)
                queryBuilder.andWhere('question.active = :active', {
                    active: false,
                });
        }
        if (filterOptions.dateFrom) {
            const endDate = filterOptions.dateTo || new Date();
            queryBuilder.andWhere(
                'question.createdAt BETWEEN :dateFrom AND :dateTo',
                {
                    dateFrom: filterOptions.dateFrom,
                    dateTo: endDate,
                },
            );
        }
        if (filterOptions.categories)
            queryBuilder.andWhere(`categories.id IN (:...categories)`, {
                categories: [...filterOptions.categories],
            });
        if (filterOptions.section && !isNaN(filterOptions.section))
            queryBuilder.andWhere(`question.section = :section`, {
                section: filterOptions?.section,
            });
        if (Object.values(EType).includes(filterOptions.type))
            queryBuilder.andWhere(`question.type = :type`, {
                type: filterOptions?.type,
            });
        if (filterOptions.search) {
            queryBuilder.andWhere(`question.text ILIKE :text`, {
                text: `%${filterOptions?.search}%`,
            });
        }
        if (sort) {
            queryBuilder.orderBy(
                sort.split('__')[0] === 'NAME'
                    ? 'question.text'
                    : 'question.createdAt',
                sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC',
            );
        }
        const result = await queryBuilder
            .skip((options.page - 1) * options.limit)
            .take(options.limit)
            .getManyAndCount();
        return {
            items: result[0],
            totalItems: result[1],
            itemCount: result[0].length,
            itemsPerPage: options.limit,
            totalPages: Math.ceil(result[1] / options.limit),
            currentPage: options.page,
        };
    }

    async findOne(id: number): Promise<Question> {
        const question = await this.questionRepo
            .findOne(id, {
                relations: ['categories', 'section'],
            })
            .catch(() => {
                throw new NotFoundException('Section not found');
            });
        if (!question) throw new NotFoundException('Question not found');
        return question;
    }

    async update(
        id: number,
        updateQuestionDto: UpdateQuestionDto,
    ): Promise<Question> {
        let question = await this.findOne(id);
        question = {
            ...question,
            ...pick(updateQuestionDto, [
                'text',
                'requiresAttachments',
                'type',
                'subcategoryId',
                'subsectionId',
            ]),
        };
        if (updateQuestionDto.sectionId) {
            const section = await this.sectionRepo.findOne(
                updateQuestionDto.sectionId,
            );
            if (!section)
                throw new NotFoundException('Section not found or not active');
            question.section = section;
        }
        if (updateQuestionDto.categoryIds) {
            const newCategories: Category[] = [];
            for (const cid of updateQuestionDto.categoryIds) {
                const category = await this.categoryRepo.findOne(cid);
                if (category) {
                    if (!newCategories.find((c) => c.id === category.id)) {
                        newCategories.push(category);
                    }
                }
            }
            if (newCategories.length) question.categories = newCategories;
        }
        if (updateQuestionDto.possibleAnswers) {
            if (question.type === EType.OPEN)
                throw new BadRequestException(
                    'You cannot only set custom possible answers for multiple suggestion questions',
                );
            question.possibleAnswers = updateQuestionDto.possibleAnswers;
        }

        return await this.questionRepo.save(question);
    }

    async addCategory(id: number, categoryId: number): Promise<void> {
        const question = await this.findOne(id);
        const category = await this.categoryRepo.findOne(categoryId);
        if (!category) throw new NotFoundException('Category not found');
        if (question.categories.find((c) => c.id === category.id))
            throw new ConflictException(
                'This question already has this category',
            );
        question.categories.push(category);
        await this.questionRepo.save(question);
        return;
    }

    async removeCategory(id: number, categoryId: number): Promise<void> {
        const question = await this.findOne(id);
        const category = await this.categoryRepo.findOne(categoryId);
        if (!category) throw new NotFoundException('Category not found');
        question.categories = [
            ...question.categories.filter((c) => c.id !== categoryId),
        ];
        await this.questionRepo.save(question);
        return;
    }

    async remove(id: number): Promise<void> {
        const question = await this.findOne(id);
        if (question.hasBeenAsked)
            throw new BadRequestException(
                "This question has already been asked and can't be deleted",
            );
        await this.questionRepo.softDelete(id);
        return;
    }

    async toggleActive(id: number): Promise<boolean> {
        const question = await this.findOne(id);
        if (question.active && question.hasBeenAsked)
            throw new BadRequestException(
                "This question has already been asked and can't be deactivated",
            );
        question.active = !question.active;
        return (await this.questionRepo.save(question)).active;
    }
}
