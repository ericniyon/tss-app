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
exports.SectionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const decorators_1 = require("../shared/decorators");
const roles_enum_1 = require("../shared/enums/roles.enum");
const user_entity_1 = require("../users/entities/user.entity");
const create_section_dto_1 = require("./dto/create-section.dto");
const section_filter_options_dto_1 = require("./dto/section-filter-options.dto");
const update_section_dto_1 = require("./dto/update-section.dto");
const section_entity_1 = require("./entities/section.entity");
const section_service_1 = require("./section.service");
let SectionController = class SectionController {
    constructor(sectionService) {
        this.sectionService = sectionService;
    }
    async createSection(createSectionDto) {
        const results = await this.sectionService.create(createSectionDto);
        return {
            message: 'Section created successfully',
            results,
        };
    }
    async findAll(options, filterOptions, user) {
        const results = await this.sectionService.findAll(options, filterOptions, user);
        return {
            message: 'Sections retrieved successfully',
            results,
        };
    }
    async findOne(id) {
        const results = await this.sectionService.findOne(+id);
        return {
            message: 'Section retrieved successfully',
            results,
        };
    }
    async update(id, updateSectionDto) {
        const results = await this.sectionService.update(+id, updateSectionDto);
        return {
            message: 'Section updated successfully',
            results,
        };
    }
    async toggleActive(id) {
        const result = await this.sectionService.toggleActive(+id);
        return {
            message: `Section with title "${result.title}" ${result.active ? 'activated' : 'deactivated'}`,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.CreatedResponse)(section_entity_1.Section),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_section_dto_1.CreateSectionDto]),
    __metadata("design:returntype", Promise)
], SectionController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Paginated)(),
    (0, decorators_1.PageResponse)(section_entity_1.Section),
    __param(0, (0, decorators_1.PaginationParams)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, section_filter_options_dto_1.SectionFilterOptionsDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SectionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, decorators_1.OkResponse)(section_entity_1.Section),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SectionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, decorators_1.OkResponse)(section_entity_1.Section),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_section_dto_1.UpdateSectionDto]),
    __metadata("design:returntype", Promise)
], SectionController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.NotFoundResponse),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SectionController.prototype, "toggleActive", null);
SectionController = __decorate([
    (0, common_1.Controller)('sections'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiTags)('Sections'),
    (0, swagger_1.ApiExtraModels)(section_entity_1.Section),
    (0, decorators_1.ErrorResponses)(decorators_1.UnauthorizedResponse, decorators_1.ForbiddenResponse),
    __metadata("design:paramtypes", [section_service_1.SectionService])
], SectionController);
exports.SectionController = SectionController;
//# sourceMappingURL=section.controller.js.map