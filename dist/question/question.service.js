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
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pick = require("lodash.pick");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../category/entities/category.entity");
const section_entity_1 = require("../section/entities/section.entity");
const roles_enum_1 = require("../shared/enums/roles.enum");
const date_util_1 = require("../shared/utils/date.util");
const question_entity_1 = require("./entities/question.entity");
const enums_1 = require("./enums");
let QuestionService = class QuestionService {
    constructor(questionRepo, sectionRepo, categoryRepo) {
        this.questionRepo = questionRepo;
        this.sectionRepo = sectionRepo;
        this.categoryRepo = categoryRepo;
    }
    async create(createQuestionDto) {
        let newQuestion = new question_entity_1.Question();
        newQuestion = Object.assign(Object.assign({}, newQuestion), pick(createQuestionDto, ['text', 'requiresAttachments', 'type']));
        if (createQuestionDto.sectionId) {
            const section = await this.sectionRepo.findOne({
                id: createQuestionDto.sectionId,
                active: true,
            });
            if (!section)
                throw new common_1.NotFoundException('Section not found or not active');
            newQuestion.section = section;
        }
        const promises = createQuestionDto.categoryIds.map((id) => this.categoryRepo.findOne({ id, active: true }));
        newQuestion.categories = (await Promise.all(promises))
            .map((c) => c)
            .filter((c) => c);
        if (createQuestionDto.possibleAnswers &&
            newQuestion.type !== enums_1.EType.MULTIPLE_CHOICE &&
            newQuestion.type !== enums_1.EType.SINGLE_CHOICE) {
            throw new common_1.BadRequestException('You cannot only set custom possible answers for multiple suggestion questions');
        }
        if (!createQuestionDto.possibleAnswers &&
            (newQuestion.type === enums_1.EType.MULTIPLE_CHOICE ||
                newQuestion.type === enums_1.EType.SINGLE_CHOICE))
            throw new common_1.BadRequestException('Possible answers are required for multiple suggestion questions');
        newQuestion.possibleAnswers = createQuestionDto.possibleAnswers;
        return await this.questionRepo.save(newQuestion);
    }
    async findAll(options, role, _a) {
        var { sort } = _a, filterOptions = __rest(_a, ["sort"]);
        let { status } = filterOptions;
        if (!status && ![roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT].includes(role)) {
            status = enums_1.EStatus.ACTIVE;
        }
        const queryBuilder = this.questionRepo.createQueryBuilder('question');
        queryBuilder
            .leftJoin('question.section', 'section')
            .leftJoin('question.categories', 'categories')
            .leftJoin('question.subsection', 'subsection')
            .addSelect([
            'section.id',
            'section.title',
            'categories.id',
            'categories.name',
            'subsection.id',
            'subsection.name',
        ]);
        const { actualStartDate, actualEndDate } = (0, date_util_1.getActualDateRange)(filterOptions.dateFrom, filterOptions.dateTo);
        if (actualStartDate) {
            queryBuilder.andWhere('question.createdAt BETWEEN :actualStartDate AND :actualEndDate', {
                actualStartDate,
                actualEndDate,
            });
        }
        if (status) {
            if (status == enums_1.EStatus.ACTIVE)
                queryBuilder.where('question.active = :active', {
                    active: true,
                });
            if (status == enums_1.EStatus.INACTIVE)
                queryBuilder.andWhere('question.active = :active', {
                    active: false,
                });
        }
        if (filterOptions.dateFrom) {
            const endDate = filterOptions.dateTo || new Date();
            queryBuilder.andWhere('question.createdAt BETWEEN :dateFrom AND :dateTo', {
                dateFrom: filterOptions.dateFrom,
                dateTo: endDate,
            });
        }
        if (filterOptions.categories)
            queryBuilder.andWhere(`categories.id IN (:...categories)`, {
                categories: [...filterOptions.categories],
            });
        if (filterOptions.section && !isNaN(filterOptions.section))
            queryBuilder.andWhere(`question.section = :section`, {
                section: filterOptions === null || filterOptions === void 0 ? void 0 : filterOptions.section,
            });
        if (Object.values(enums_1.EType).includes(filterOptions.type))
            queryBuilder.andWhere(`question.type = :type`, {
                type: filterOptions === null || filterOptions === void 0 ? void 0 : filterOptions.type,
            });
        if (filterOptions.search) {
            queryBuilder.andWhere(`question.text ILIKE :text`, {
                text: `%${filterOptions === null || filterOptions === void 0 ? void 0 : filterOptions.search}%`,
            });
        }
        if (sort) {
            queryBuilder.orderBy(sort.split('__')[0] === 'NAME'
                ? 'question.text'
                : 'question.createdAt', sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC');
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
    async findOne(id) {
        const question = await this.questionRepo
            .findOne(id, {
            relations: ['categories', 'section'],
        })
            .catch(() => {
            throw new common_1.NotFoundException('Section not found');
        });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        return question;
    }
    async update(id, updateQuestionDto) {
        let question = await this.findOne(id);
        question = Object.assign(Object.assign({}, question), pick(updateQuestionDto, ['text', 'requiresAttachments', 'type']));
        if (updateQuestionDto.sectionId) {
            const section = await this.sectionRepo.findOne(updateQuestionDto.sectionId);
            if (!section)
                throw new common_1.NotFoundException('Section not found or not active');
            question.section = section;
        }
        if (updateQuestionDto.categoryIds) {
            const newCategories = [];
            for (const cid of updateQuestionDto.categoryIds) {
                const category = await this.categoryRepo.findOne(cid);
                if (category) {
                    if (!newCategories.find((c) => c.id === category.id)) {
                        newCategories.push(category);
                    }
                }
            }
            if (newCategories.length)
                question.categories = newCategories;
        }
        if (updateQuestionDto.possibleAnswers) {
            if (question.type === enums_1.EType.OPEN)
                throw new common_1.BadRequestException('You cannot only set custom possible answers for multiple suggestion questions');
            question.possibleAnswers = updateQuestionDto.possibleAnswers;
        }
        return await this.questionRepo.save(question);
    }
    async addCategory(id, categoryId) {
        const question = await this.findOne(id);
        const category = await this.categoryRepo.findOne(categoryId);
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        if (question.categories.find((c) => c.id === category.id))
            throw new common_1.ConflictException('This question already has this category');
        question.categories.push(category);
        await this.questionRepo.save(question);
        return;
    }
    async removeCategory(id, categoryId) {
        const question = await this.findOne(id);
        const category = await this.categoryRepo.findOne(categoryId);
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        question.categories = [
            ...question.categories.filter((c) => c.id !== categoryId),
        ];
        await this.questionRepo.save(question);
        return;
    }
    async remove(id) {
        const question = await this.findOne(id);
        if (question.hasBeenAsked)
            throw new common_1.BadRequestException("This question has already been asked and can't be deleted");
        await this.questionRepo.softDelete(id);
        return;
    }
    async toggleActive(id) {
        const question = await this.findOne(id);
        if (question.active && question.hasBeenAsked)
            throw new common_1.BadRequestException("This question has already been asked and can't be deactivated");
        question.active = !question.active;
        return (await this.questionRepo.save(question)).active;
    }
};
QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(1, (0, typeorm_1.InjectRepository)(section_entity_1.Section)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuestionService);
exports.QuestionService = QuestionService;
//# sourceMappingURL=question.service.js.map