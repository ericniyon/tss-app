"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const typeorm_2 = require("typeorm");
const enums_1 = require("../question/enums");
const roles_enum_1 = require("../shared/enums/roles.enum");
const date_util_1 = require("../shared/utils/date.util");
const subcategory_entity_1 = require("../subcategory/entities/subcategory.entity");
const section_entity_1 = require("../section/entities/section.entity");
const subsection_entity_1 = require("../subsection/entities/subsection.entity");
const question_entity_1 = require("../question/entities/question.entity");
const application_entity_1 = require("../application/entities/application.entity");
const answer_entity_1 = require("../application/entities/answer.entity");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const notification_entity_1 = require("../notification/entities/notification.entity");
const category_entity_1 = require("./entities/category.entity");
let CategoryService = class CategoryService {
    constructor(categoryRepo, subcategoryRepo, sectionRepo, subsectionRepo, questionRepo, applicationRepo, answerRepo, certificateRepo, notificationRepo) {
        this.categoryRepo = categoryRepo;
        this.subcategoryRepo = subcategoryRepo;
        this.sectionRepo = sectionRepo;
        this.subsectionRepo = subsectionRepo;
        this.questionRepo = questionRepo;
        this.applicationRepo = applicationRepo;
        this.answerRepo = answerRepo;
        this.certificateRepo = certificateRepo;
        this.notificationRepo = notificationRepo;
    }
    async create(createCategoryDto) {
        if (await this.categoryRepo.findOne({
            where: { name: (0, typeorm_2.ILike)(createCategoryDto.name) },
        }))
            throw new common_1.ConflictException('Category with the same name already exists');
        return await this.categoryRepo.save(Object.assign({}, createCategoryDto));
    }
    async findAll(options, _a, user) {
        var { sort, search } = _a, filterOptions = __rest(_a, ["sort", "search"]);
        const queryBuilder = this.categoryRepo.createQueryBuilder('c');
        const { actualStartDate, actualEndDate } = (0, date_util_1.getActualDateRange)(filterOptions.dateFrom, filterOptions.dateTo);
        if (actualStartDate) {
            queryBuilder.andWhere('c.createdAt BETWEEN :actualStartDate AND :actualEndDate', {
                actualStartDate,
                actualEndDate,
            });
        }
        if (!filterOptions.status &&
            ![roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT].includes(user.role)) {
            filterOptions.status = enums_1.EStatus.ACTIVE;
        }
        if (filterOptions.status) {
            if (filterOptions.status == enums_1.EStatus.ACTIVE)
                queryBuilder.andWhere('c.active = :active', {
                    active: true,
                });
            if (filterOptions.status == enums_1.EStatus.INACTIVE)
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
            queryBuilder.orderBy(sort.split('__')[0] === 'NAME' ? 'c.name' : 'c.createdAt', sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC');
        }
        const { items, meta } = await (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, options);
        return Object.assign({ items }, meta);
    }
    async findOne(id) {
        return await this.categoryRepo.findOneOrFail(id).catch(() => {
            throw new common_1.NotFoundException('Category not found');
        });
    }
    async update(id, updateCategoryDto) {
        let category = await this.findOne(id);
        if ((updateCategoryDto === null || updateCategoryDto === void 0 ? void 0 : updateCategoryDto.name) &&
            (await this.categoryRepo.findOne({
                where: {
                    id: (0, typeorm_2.Not)(category.id),
                    name: (0, typeorm_2.ILike)(updateCategoryDto.name),
                },
            })))
            throw new common_1.ConflictException('Category with the same name already exists');
        category = Object.assign(Object.assign({}, category), updateCategoryDto);
        return this.categoryRepo.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        await this.categoryRepo.manager.transaction(async (transactionalEntityManager) => {
            const subcategories = await transactionalEntityManager.find(subcategory_entity_1.Subcategory, {
                where: { category: { id: category.id } },
            });
            const subcategoryIds = subcategories.map((sc) => sc.id);
            const sections = subcategoryIds.length > 0
                ? await transactionalEntityManager.find(section_entity_1.Section, {
                    where: { subcategoryId: (0, typeorm_2.In)(subcategoryIds) },
                })
                : [];
            const sectionIds = sections.map((s) => s.id);
            const subsections = sectionIds.length > 0
                ? await transactionalEntityManager
                    .createQueryBuilder(subsection_entity_1.Subsection, 'ss')
                    .where('ss.section IN (:...sectionIds)', {
                    sectionIds,
                })
                    .getMany()
                : [];
            const subsectionIds = subsections.map((ss) => ss.id);
            const questionsViaCategory = await transactionalEntityManager
                .createQueryBuilder(question_entity_1.Question, 'q')
                .innerJoin('q.categories', 'c')
                .where('c.id = :categoryId', { categoryId: category.id })
                .getMany();
            const questionsViaSubcategory = subcategoryIds.length > 0
                ? await transactionalEntityManager.find(question_entity_1.Question, {
                    where: { subcategory: { id: (0, typeorm_2.In)(subcategoryIds) } },
                })
                : [];
            const questionsViaSection = sectionIds.length > 0
                ? await transactionalEntityManager.find(question_entity_1.Question, {
                    where: { section: { id: (0, typeorm_2.In)(sectionIds) } },
                })
                : [];
            const questionsViaSubsection = subsectionIds.length > 0
                ? await transactionalEntityManager.find(question_entity_1.Question, {
                    where: {
                        subsection: { id: (0, typeorm_2.In)(subsectionIds) },
                    },
                })
                : [];
            const allQuestionIds = [
                ...new Set([
                    ...questionsViaCategory.map((q) => q.id),
                    ...questionsViaSubcategory.map((q) => q.id),
                    ...questionsViaSection.map((q) => q.id),
                    ...questionsViaSubsection.map((q) => q.id),
                ]),
            ];
            const applications = await transactionalEntityManager.find(application_entity_1.Application, {
                where: { category: { id: category.id } },
            });
            const applicationIds = applications.map((a) => a.id);
            if (allQuestionIds.length > 0 || applicationIds.length > 0) {
                let answerQueryBuilder = transactionalEntityManager
                    .createQueryBuilder()
                    .delete()
                    .from(answer_entity_1.Answer);
                const conditions = [];
                const parameters = {};
                if (allQuestionIds.length > 0) {
                    conditions.push('questionId IN (:...questionIds)');
                    parameters.questionIds = allQuestionIds;
                }
                if (applicationIds.length > 0) {
                    conditions.push('applicationId IN (:...applicationIds)');
                    parameters.applicationIds = applicationIds;
                }
                if (conditions.length > 0) {
                    answerQueryBuilder = answerQueryBuilder.where(conditions.join(' OR '), parameters);
                    await answerQueryBuilder.execute();
                }
            }
            if (applicationIds.length > 0) {
                await transactionalEntityManager
                    .createQueryBuilder()
                    .delete()
                    .from(certificate_entity_1.Certificate)
                    .where('applicationId IN (:...applicationIds)', {
                    applicationIds,
                })
                    .execute();
            }
            if (applicationIds.length > 0) {
                await transactionalEntityManager.delete(application_entity_1.Application, applicationIds);
            }
            if (allQuestionIds.length > 0) {
                await transactionalEntityManager.delete(question_entity_1.Question, allQuestionIds);
            }
            if (subsectionIds.length > 0) {
                await transactionalEntityManager.delete(subsection_entity_1.Subsection, subsectionIds);
            }
            if (sectionIds.length > 0) {
                await transactionalEntityManager.delete(section_entity_1.Section, sectionIds);
            }
            if (subcategoryIds.length > 0) {
                await transactionalEntityManager.delete(subcategory_entity_1.Subcategory, subcategoryIds);
            }
            await transactionalEntityManager
                .createQueryBuilder()
                .delete()
                .from(notification_entity_1.Notification)
                .where('targetCategoryId = :categoryId', {
                categoryId: category.id,
            })
                .execute();
            await transactionalEntityManager.delete(category_entity_1.Category, category.id);
        });
    }
    async toggleActive(id) {
        const category = await this.findOne(id);
        category.active = !category.active;
        const result = await this.categoryRepo.save(category);
        return result;
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(subcategory_entity_1.Subcategory)),
    __param(2, (0, typeorm_1.InjectRepository)(section_entity_1.Section)),
    __param(3, (0, typeorm_1.InjectRepository)(subsection_entity_1.Subsection)),
    __param(4, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(5, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(6, (0, typeorm_1.InjectRepository)(answer_entity_1.Answer)),
    __param(7, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(8, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map