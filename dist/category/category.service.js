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
const category_entity_1 = require("./entities/category.entity");
let CategoryService = class CategoryService {
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async create(createCategoryDto) {
        if (await this.categoryRepo.findOne({ name: createCategoryDto.name }))
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
                queryBuilder.where('c.active = :active', {
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
        if (await this.categoryRepo.findOne({
            where: {
                id: (0, typeorm_2.Not)(category.id),
                name: (0, typeorm_2.ILike)(updateCategoryDto === null || updateCategoryDto === void 0 ? void 0 : updateCategoryDto.name),
            },
        }))
            throw new common_1.ConflictException('Category with the same name already exists');
        category = Object.assign(Object.assign({}, category), updateCategoryDto);
        return this.categoryRepo.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        this.categoryRepo.softDelete(category.id);
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
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map