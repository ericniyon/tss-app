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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const decorators_1 = require("../shared/decorators");
const roles_enum_1 = require("../shared/enums/roles.enum");
const user_entity_1 = require("../users/entities/user.entity");
const category_service_1 = require("./category.service");
const category_filter_options_dto_1 = require("./dto/category-filter-options.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const category_entity_1 = require("./entities/category.entity");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(createCategoryDto) {
        return {
            message: 'Category created successfully',
            results: await this.categoryService.create(createCategoryDto),
        };
    }
    async findAll(user, options, filterOptions) {
        return {
            message: 'Categories retrieved',
            results: await this.categoryService.findAll(options, filterOptions, user),
        };
    }
    async findOne(id) {
        return {
            message: 'Category retrieved successfully',
            results: await this.categoryService.findOne(+id),
        };
    }
    async update(id, updateCategoryDto) {
        return {
            message: 'Category updated successfully',
            results: await this.categoryService.update(+id, updateCategoryDto),
        };
    }
    async remove(id) {
        await this.categoryService.remove(+id);
        return {
            message: `Category with id[${id}] deleted`,
        };
    }
    async toggleActive(id) {
        const result = await this.categoryService.toggleActive(+id);
        return {
            message: `Category with name "${result.name}" ${result.active ? 'activated' : 'deactivated'}`,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    (0, decorators_1.CreatedResponse)(category_entity_1.Category),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Paginated)(),
    (0, decorators_1.PageResponse)(category_entity_1.Category),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, decorators_1.PaginationParams)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, category_filter_options_dto_1.CategoryFilterOptionsDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.OkResponse)(category_entity_1.Category),
    (0, decorators_1.ErrorResponses)(decorators_1.NotFoundResponse),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    (0, decorators_1.OkResponse)(category_entity_1.Category),
    (0, decorators_1.ErrorResponses)(decorators_1.NotFoundResponse),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.NotFoundResponse),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.NotFoundResponse),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "toggleActive", null);
CategoryController = __decorate([
    (0, common_1.Controller)('categories'),
    (0, swagger_1.ApiTags)('Categories'),
    (0, swagger_1.ApiExtraModels)(category_entity_1.Category),
    (0, auth_decorator_1.Auth)(),
    (0, decorators_1.ErrorResponses)(decorators_1.UnauthorizedResponse, decorators_1.ForbiddenResponse),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map