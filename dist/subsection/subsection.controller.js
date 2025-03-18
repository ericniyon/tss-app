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
exports.SubsectionController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("../shared/decorators");
const roles_enum_1 = require("../shared/enums/roles.enum");
const subsection_entity_1 = require("./entities/subsection.entity");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const subsection_service_1 = require("./subsection.service");
const create_subsection_dto_1 = require("./dto/create-subsection.dto");
const subsection_filter_option_1 = require("./dto/subsection-filter-option");
const update_subsection_dto_1 = require("./dto/update-subsection.dto");
let SubsectionController = class SubsectionController {
    constructor(subsectionService) {
        this.subsectionService = subsectionService;
    }
    async createSubsection(createSubsectionDto) {
        const results = await this.subsectionService.create(createSubsectionDto);
        return {
            message: 'Subsection created successfully',
            results,
        };
    }
    async findAll(options, filterOptions) {
        const results = await this.subsectionService.findAll(options, filterOptions);
        return {
            message: 'Subsections retrieved successfully',
            results,
        };
    }
    async findById(id) {
        if (!id) {
            throw new common_1.BadRequestException('Subsection ID is required');
        }
        const results = await this.subsectionService.findById(id);
        return { message: 'Subsection retrieved successfully', results };
    }
    async update(id, updateSubsectionDto) {
        if (!id) {
            throw new common_1.BadRequestException('Subsection ID is required');
        }
        const results = await this.subsectionService.update(id, updateSubsectionDto);
        return { message: 'Subsection updated successfully', results };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.CreatedResponse)(subsection_entity_1.Subsection),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subsection_dto_1.CreateSubsectionDto]),
    __metadata("design:returntype", Promise)
], SubsectionController.prototype, "createSubsection", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Paginated)(),
    (0, decorators_1.PageResponse)(subsection_entity_1.Subsection),
    __param(0, (0, decorators_1.PaginationParams)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, subsection_filter_option_1.SubsectionFilterOptions]),
    __metadata("design:returntype", Promise)
], SubsectionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, decorators_1.OkResponse)(subsection_entity_1.Subsection),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubsectionController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, decorators_1.OkResponse)(subsection_entity_1.Subsection),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_subsection_dto_1.UpdateSubsectionDto]),
    __metadata("design:returntype", Promise)
], SubsectionController.prototype, "update", null);
SubsectionController = __decorate([
    (0, common_1.Controller)('subsections'),
    (0, swagger_1.ApiTags)('Subsections'),
    (0, swagger_1.ApiExtraModels)(subsection_entity_1.Subsection),
    (0, decorators_1.ErrorResponses)(decorators_1.UnauthorizedResponse, decorators_1.ForbiddenResponse),
    __metadata("design:paramtypes", [subsection_service_1.SubsectionService])
], SubsectionController);
exports.SubsectionController = SubsectionController;
//# sourceMappingURL=subsection.controller.js.map