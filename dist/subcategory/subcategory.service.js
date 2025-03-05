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
exports.SubcategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const subcategory_entity_1 = require("./entities/subcategory.entity");
const typeorm_2 = require("typeorm");
const page_interface_1 = require("../shared/interfaces/page.interface");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let SubcategoryService = class SubcategoryService {
    constructor(subcategoryRepo) {
        this.subcategoryRepo = subcategoryRepo;
    }
    async create(createSubcategoryDto) {
        if (await this.subcategoryRepo.count({
            name: createSubcategoryDto.name,
        }))
            throw new common_1.ConflictException('Subcategory with the same name already exists');
        return this.subcategoryRepo.save(Object.assign({}, createSubcategoryDto));
    }
    async findById(id) {
        const subcategory = await this.subcategoryRepo.findOne(id);
        if (!subcategory) {
            throw new common_1.NotFoundException(`Subcategory with ID ${id} not found`);
        }
        return subcategory;
    }
    async update(id, updateSubcategoryDto) {
        if (await this.subcategoryRepo.count({
            name: updateSubcategoryDto.name,
            id: (0, typeorm_2.Not)(id),
        })) {
            throw new common_1.ConflictException('Subcategory with the same name already exists');
        }
        const subcategory = await this.findById(id);
        if (!subcategory) {
            throw new common_1.NotFoundException(`Subcategory with ID ${id} not found`);
        }
        Object.assign(subcategory, updateSubcategoryDto);
        return this.subcategoryRepo.save(subcategory);
    }
    async findAll(options, filterOptions) {
        const queryBuilder = this.subcategoryRepo.createQueryBuilder('subcategory');
        if (filterOptions.name) {
            queryBuilder.andWhere('subcategory.name ILIKE :name', {
                name: `%${filterOptions.name}%`,
            });
        }
        queryBuilder.leftJoinAndSelect('subcategory.category', 'category');
        queryBuilder.orderBy('subcategory.createdAt', 'DESC');
        const { items, meta } = await (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, options);
        return Object.assign({ items }, meta);
    }
};
SubcategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subcategory_entity_1.Subcategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubcategoryService);
exports.SubcategoryService = SubcategoryService;
//# sourceMappingURL=subcategory.service.js.map