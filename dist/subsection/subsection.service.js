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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubsectionService = void 0;
const common_1 = require("@nestjs/common");
const index_js_1 = require("typeorm/index.js");
const typeorm_1 = require("@nestjs/typeorm");
const subsection_entity_1 = require("./entities/subsection.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let SubsectionService = class SubsectionService {
    constructor(subsectionRepo) {
        this.subsectionRepo = subsectionRepo;
    }
    async create(createSubsectionDto) {
        if (await this.subsectionRepo.count({
            name: createSubsectionDto.name,
        })) {
            throw new common_1.ConflictException('Subsection with the same name already exists');
        }
        return this.subsectionRepo.save(Object.assign({}, createSubsectionDto));
    }
    async findAll(options, filterOptions) {
        const queryBuilder = this.subsectionRepo.createQueryBuilder('subsections');
        if (filterOptions.name) {
            queryBuilder.where('subsections.name ILIKE :name', {
                name: `%${filterOptions.name}%`,
            });
        }
        queryBuilder.leftJoinAndSelect('subsections.section', 'section');
        queryBuilder.orderBy('subsections.createdAt', 'DESC');
        const { items, meta } = await (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, options);
        return Object.assign({ items }, meta);
    }
    async findById(id) {
        const subsection = await this.subsectionRepo.findOne(id, {
            relations: ['section'],
        });
        if (!subsection) {
            throw new common_1.NotFoundException(`Subsection with ID ${id} not found`);
        }
        return subsection;
    }
    async update(id, updateSubsectionDto) {
        if (await this.subsectionRepo.count({
            name: updateSubsectionDto.name,
            id: (0, index_js_1.Not)(id),
        })) {
            throw new common_1.ConflictException('Subsection with the same name already exists');
        }
        const subsection = await this.findById(id);
        if (!subsection) {
            throw new common_1.NotFoundException(`Subsection with ID ${id} not found`);
        }
        Object.assign(subsection, updateSubsectionDto);
        return this.subsectionRepo.save(subsection);
    }
    async delete(id) {
        const subsection = await this.findById(id);
        if (!subsection) {
            throw new common_1.NotFoundException(`Subsection with ID ${id} not found`);
        }
        await this.subsectionRepo.softDelete(subsection.id);
    }
};
SubsectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subsection_entity_1.Subsection)),
    __metadata("design:paramtypes", [index_js_1.Repository])
], SubsectionService);
exports.SubsectionService = SubsectionService;
//# sourceMappingURL=subsection.service.js.map