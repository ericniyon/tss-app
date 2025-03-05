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
exports.SectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const typeorm_2 = require("typeorm");
const enums_1 = require("../question/enums");
const roles_enum_1 = require("../shared/enums/roles.enum");
const date_util_1 = require("../shared/utils/date.util");
const section_entity_1 = require("./entities/section.entity");
let SectionService = class SectionService {
    constructor(sectionRepo) {
        this.sectionRepo = sectionRepo;
    }
    async create(createSectionDto) {
        return this.sectionRepo.save(Object.assign({}, createSectionDto));
    }
    async findAll(options, _a, user) {
        var { sort } = _a, filterOptions = __rest(_a, ["sort"]);
        let { status } = filterOptions;
        if (!status &&
            ![roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT].includes(user.role)) {
            status = enums_1.EStatus.ACTIVE;
        }
        const queryBuilder = this.sectionRepo.createQueryBuilder('s');
        const { actualStartDate, actualEndDate } = (0, date_util_1.getActualDateRange)(filterOptions.dateFrom, filterOptions.dateTo);
        if (actualStartDate) {
            queryBuilder.andWhere('s.createdAt BETWEEN :actualStartDate AND :actualEndDate', {
                actualStartDate,
                actualEndDate,
            });
        }
        if (status) {
            if (status == enums_1.EStatus.ACTIVE)
                queryBuilder.where('s.active = :active', {
                    active: true,
                });
            if (status == enums_1.EStatus.INACTIVE)
                queryBuilder.andWhere('s.active = :active', {
                    active: false,
                });
        }
        if (sort) {
            queryBuilder.orderBy(sort.split('__')[0] === 'NAME' ? 's.title' : 's.createdAt', sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC');
        }
        const { items, meta } = await (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, options);
        return Object.assign({ items }, meta);
    }
    async findOne(id) {
        const section = await this.sectionRepo.findOne(id);
        if (!section)
            throw new common_1.NotFoundException('Section not found');
        return section;
    }
    async update(id, updateSectionDto) {
        let section = await this.findOne(id);
        if (await this.sectionRepo.findOne({
            where: {
                id: (0, typeorm_2.Not)(section.id),
                title: (0, typeorm_2.ILike)(updateSectionDto === null || updateSectionDto === void 0 ? void 0 : updateSectionDto.title),
            },
        }))
            throw new common_1.ConflictException('Section with the same name already exists n');
        section = Object.assign(Object.assign({}, section), updateSectionDto);
        return await this.sectionRepo.save(section);
    }
    async toggleActive(id) {
        const section = await this.findOne(id);
        if (section.readonly)
            throw new common_1.BadRequestException('You cannot disable this section');
        section.active = !section.active;
        const result = await this.sectionRepo.save(section);
        return result;
    }
    async delete(id) {
        await this.findOne(id);
        this.sectionRepo.softDelete({ id });
    }
};
SectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(section_entity_1.Section)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SectionService);
exports.SectionService = SectionService;
//# sourceMappingURL=section.service.js.map