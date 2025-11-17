import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { ILike, In, Not, Repository } from 'typeorm';
import { EStatus } from '../question/enums';
import { Roles } from '../shared/enums/roles.enum';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { getActualDateRange } from '../shared/utils/date.util';
import { User } from '../users/entities/user.entity';
import { Subcategory } from '../subcategory/entities/subcategory.entity';
import { Section } from '../section/entities/section.entity';
import { Subsection } from '../subsection/entities/subsection.entity';
import { Question } from '../question/entities/question.entity';
import { Application } from '../application/entities/application.entity';
import { Answer } from '../application/entities/answer.entity';
import { Certificate } from '../certificate/entities/certificate.entity';
import { Notification } from '../notification/entities/notification.entity';
import { CategoryFilterOptionsDto } from './dto/category-filter-options.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

/**
 * @Service Category operations
 */
@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Subcategory)
        private readonly subcategoryRepo: Repository<Subcategory>,
        @InjectRepository(Section)
        private readonly sectionRepo: Repository<Section>,
        @InjectRepository(Subsection)
        private readonly subsectionRepo: Repository<Subsection>,
        @InjectRepository(Question)
        private readonly questionRepo: Repository<Question>,
        @InjectRepository(Application)
        private readonly applicationRepo: Repository<Application>,
        @InjectRepository(Answer)
        private readonly answerRepo: Repository<Answer>,
        @InjectRepository(Certificate)
        private readonly certificateRepo: Repository<Certificate>,
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,
    ) {}

    /**
     * Create new category
     * @param createCategoryDto category body
     * @returns new category
     */
    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        if (
            await this.categoryRepo.findOne({
                where: { name: ILike(createCategoryDto.name) },
            })
        )
            throw new ConflictException(
                'Category with the same name already exists',
            );
        return await this.categoryRepo.save({ ...createCategoryDto });
    }

    /**
     *
     * @returns all categories
     */
    async findAll(
        options: IPagination,
        { sort, search, ...filterOptions }: CategoryFilterOptionsDto,
        user: User,
    ): Promise<IPage<Category>> {
        const queryBuilder = this.categoryRepo.createQueryBuilder('c');
        const { actualStartDate, actualEndDate } = getActualDateRange(
            filterOptions.dateFrom,
            filterOptions.dateTo,
        );
        if (actualStartDate) {
            queryBuilder.andWhere(
                'c.createdAt BETWEEN :actualStartDate AND :actualEndDate',
                {
                    actualStartDate,
                    actualEndDate,
                },
            );
        }

        if (
            !filterOptions.status &&
            ![Roles.DBI_ADMIN, Roles.DBI_EXPERT].includes(user.role)
        ) {
            filterOptions.status = EStatus.ACTIVE;
        }
        if (filterOptions.status) {
            if (filterOptions.status == EStatus.ACTIVE)
                queryBuilder.andWhere('c.active = :active', {
                    active: true,
                });
            if (filterOptions.status == EStatus.INACTIVE)
                queryBuilder.andWhere('c.active = :active', {
                    active: false,
                });
        }
        if (search) {
            queryBuilder.andWhere('c.name ILIKE :search', {
                search: `%${search}%`,
            });
        }
        if (sort) {
            queryBuilder.orderBy(
                sort.split('__')[0] === 'NAME' ? 'c.name' : 'c.createdAt',
                sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC',
            );
        }
        const { items, meta } = await paginate(queryBuilder, options);
        return { items, ...meta };
    }

    /**
     * Find one category
     * @param id of the category
     * @returns category
     */
    async findOne(id: number): Promise<Category> {
        return await this.categoryRepo.findOneOrFail(id).catch(() => {
            throw new NotFoundException('Category not found');
        });
    }

    /**
     * Update a category
     * @param id of the category
     * @param updateCategoryDto updated body
     * @returns updated category
     */
    async update(
        id: number,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        let category = await this.findOne(id);
        if (
            updateCategoryDto?.name &&
            (await this.categoryRepo.findOne({
                where: {
                    id: Not(category.id),
                    name: ILike(updateCategoryDto.name),
                },
            }))
        )
            throw new ConflictException(
                'Category with the same name already exists',
            );
        category = { ...category, ...updateCategoryDto };
        return this.categoryRepo.save(category);
    }

    /**
     * Remove a category and all related entities (hard delete)
     * Deletes in order: Answers -> Certificates -> Applications -> Questions -> Subsections -> Sections -> Subcategories -> Notifications -> Category
     * @param id of the category
     */
    async remove(id: number): Promise<void> {
        const category = await this.findOne(id);

        // Use transaction to ensure atomicity
        await this.categoryRepo.manager.transaction(
            async (transactionalEntityManager) => {
                // 1. Get all subcategories for this category
                const subcategories = await transactionalEntityManager.find(
                    Subcategory,
                    {
                        where: { category: { id: category.id } },
                    },
                );
                const subcategoryIds = subcategories.map((sc) => sc.id);

                // 2. Get all sections belonging to these subcategories
                const sections =
                    subcategoryIds.length > 0
                        ? await transactionalEntityManager.find(Section, {
                              where: { subcategoryId: In(subcategoryIds) },
                          })
                        : [];
                const sectionIds = sections.map((s) => s.id);

                // 3. Get all subsections belonging to these sections
                const subsections =
                    sectionIds.length > 0
                        ? await transactionalEntityManager
                              .createQueryBuilder(Subsection, 'ss')
                              .where('ss.section IN (:...sectionIds)', {
                                  sectionIds,
                              })
                              .getMany()
                        : [];
                const subsectionIds = subsections.map((ss) => ss.id);

                // 4. Get all questions related to this category (multiple paths)
                // Questions via junction table (Many-to-Many with Category)
                const questionsViaCategory =
                    await transactionalEntityManager
                        .createQueryBuilder(Question, 'q')
                        .innerJoin('q.categories', 'c')
                        .where('c.id = :categoryId', { categoryId: category.id })
                        .getMany();

                // Questions via subcategory
                const questionsViaSubcategory =
                    subcategoryIds.length > 0
                        ? await transactionalEntityManager.find(Question, {
                              where: { subcategory: { id: In(subcategoryIds) } },
                          })
                        : [];

                // Questions via section
                const questionsViaSection =
                    sectionIds.length > 0
                        ? await transactionalEntityManager.find(Question, {
                              where: { section: { id: In(sectionIds) } },
                          })
                        : [];

                // Questions via subsection
                const questionsViaSubsection =
                    subsectionIds.length > 0
                        ? await transactionalEntityManager.find(Question, {
                              where: {
                                  subsection: { id: In(subsectionIds) },
                              },
                          })
                        : [];

                // Combine all question IDs (remove duplicates)
                const allQuestionIds = [
                    ...new Set([
                        ...questionsViaCategory.map((q) => q.id),
                        ...questionsViaSubcategory.map((q) => q.id),
                        ...questionsViaSection.map((q) => q.id),
                        ...questionsViaSubsection.map((q) => q.id),
                    ]),
                ];

                // 5. Get all applications for this category
                const applications =
                    await transactionalEntityManager.find(Application, {
                        where: { category: { id: category.id } },
                    });
                const applicationIds = applications.map((a) => a.id);

                // 6. Delete Answers (related to questions or applications)
                if (allQuestionIds.length > 0 || applicationIds.length > 0) {
                    let answerQueryBuilder =
                        transactionalEntityManager
                            .createQueryBuilder()
                            .delete()
                            .from(Answer);

                    const conditions: string[] = [];
                    const parameters: any = {};

                    if (allQuestionIds.length > 0) {
                        conditions.push('questionId IN (:...questionIds)');
                        parameters.questionIds = allQuestionIds;
                    }
                    if (applicationIds.length > 0) {
                        conditions.push('applicationId IN (:...applicationIds)');
                        parameters.applicationIds = applicationIds;
                    }

                    if (conditions.length > 0) {
                        answerQueryBuilder = answerQueryBuilder.where(
                            conditions.join(' OR '),
                            parameters,
                        );
                        await answerQueryBuilder.execute();
                    }
                }

                // 7. Delete Certificates (related to applications)
                if (applicationIds.length > 0) {
                    await transactionalEntityManager
                        .createQueryBuilder()
                        .delete()
                        .from(Certificate)
                        .where('applicationId IN (:...applicationIds)', {
                            applicationIds,
                        })
                        .execute();
                }

                // 8. Delete Applications
                if (applicationIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Application,
                        applicationIds,
                    );
                }

                // 9. Delete Questions
                if (allQuestionIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Question,
                        allQuestionIds,
                    );
                }

                // 10. Delete Subsections
                if (subsectionIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Subsection,
                        subsectionIds,
                    );
                }

                // 11. Delete Sections
                if (sectionIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Section,
                        sectionIds,
                    );
                }

                // 12. Delete Subcategories
                if (subcategoryIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Subcategory,
                        subcategoryIds,
                    );
                }

                // 13. Delete Notifications
                await transactionalEntityManager
                    .createQueryBuilder()
                    .delete()
                    .from(Notification)
                    .where('targetCategoryId = :categoryId', {
                        categoryId: category.id,
                    })
                    .execute();

                // 14. Finally, delete the Category
                await transactionalEntityManager.delete(Category, category.id);
            },
        );
    }

    /**
     * Toggle active status
     * @param id of the category
     */
    async toggleActive(id: number): Promise<Category> {
        const category = await this.findOne(id);
        category.active = !category.active;
        const result = await this.categoryRepo.save(category);
        return result;
    }
}
