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
exports.SubcategoryController = void 0;
const common_1 = require("@nestjs/common");
const subcategory_entity_1 = require("./entities/subcategory.entity");
const decorators_1 = require("../shared/decorators");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const roles_enum_1 = require("../shared/enums/roles.enum");
const subcategory_service_1 = require("./subcategory.service");
const create_subcategory_dto_1 = require("./dto/create-subcategory.dto");
const update_subcategory_dto_1 = require("./dto/update-subcategory.dto");
const subcategory_filter_options_1 = require("./dto/subcategory-filter-options");
let SubcategoryController = class SubcategoryController {
    constructor(subcategoryService) {
        this.subcategoryService = subcategoryService;
    }
    async createSubcategory(createSubcategoryDto) {
        const results = await this.subcategoryService.create(createSubcategoryDto);
        return {
            message: 'Subcategory created successfully',
            results,
        };
    }
    async findAll(options, filterOptions) {
        const results = await this.subcategoryService.findAll(options, filterOptions);
        return {
            message: 'Subcategory retrieved successfully',
            results,
        };
    }
    async findById(id) {
        if (!id) {
            throw new common_1.BadRequestException('Subcategory ID is required');
        }
        const results = await this.subcategoryService.findById(id);
        return {
            message: 'Subcategory retrieved successfully',
            results,
        };
    }
    async update(id, updateSubcategoryDto) {
        const results = await this.subcategoryService.update(id, updateSubcategoryDto);
        return {
            message: 'Subcategory updated successfully',
            results,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.CreatedResponse)(subcategory_entity_1.Subcategory),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subcategory_dto_1.CreateSubcategoryDto]),
    __metadata("design:returntype", Promise)
], SubcategoryController.prototype, "createSubcategory", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Paginated)(),
    (0, decorators_1.PageResponse)(subcategory_entity_1.Subcategory),
    __param(0, (0, decorators_1.PaginationParams)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, subcategory_filter_options_1.SubcategoryFilterOptions]),
    __metadata("design:returntype", Promise)
], SubcategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, decorators_1.OkResponse)(subcategory_entity_1.Subcategory),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubcategoryController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, decorators_1.OkResponse)(subcategory_entity_1.Subcategory),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_subcategory_dto_1.UpdateSubcategoryDto]),
    __metadata("design:returntype", Promise)
], SubcategoryController.prototype, "update", null);
SubcategoryController = __decorate([
    (0, common_1.Controller)('subcategories'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiTags)('Subcategories'),
    (0, swagger_1.ApiExtraModels)(subcategory_entity_1.Subcategory),
    (0, decorators_1.ErrorResponses)(decorators_1.UnauthorizedResponse, decorators_1.ForbiddenResponse),
    __metadata("design:paramtypes", [subcategory_service_1.SubcategoryService])
], SubcategoryController);
exports.SubcategoryController = SubcategoryController;
//# sourceMappingURL=subcategory.controller.js.map