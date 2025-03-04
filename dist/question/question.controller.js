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
exports.QuestionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const category_entity_1 = require("../category/entities/category.entity");
const section_entity_1 = require("../section/entities/section.entity");
const decorators_1 = require("../shared/decorators");
const roles_enum_1 = require("../shared/enums/roles.enum");
const user_entity_1 = require("../users/entities/user.entity");
const create_question_dto_1 = require("./dto/create-question.dto");
const question_filter_options_dto_1 = require("./dto/question-filter-options.dto");
const update_question_dto_1 = require("./dto/update-question.dto");
const question_entity_1 = require("./entities/question.entity");
const question_service_1 = require("./question.service");
let QuestionController = class QuestionController {
    constructor(questionService) {
        this.questionService = questionService;
    }
    async create(createQuestionDto) {
        const results = await this.questionService.create(createQuestionDto);
        return {
            message: 'Question created successfully',
            results,
        };
    }
    async findAll(options, filterOptions, user) {
        const results = await this.questionService.findAll(options, user.role, filterOptions);
        return {
            message: 'Questions retrieved successfully',
            results,
        };
    }
    async findOne(id) {
        const results = await this.questionService.findOne(+id);
        return {
            message: 'Question retrieved',
            results,
        };
    }
    async update(id, updateQuestionDto) {
        const results = await this.questionService.update(+id, updateQuestionDto);
        return {
            message: 'Question updated successfully',
            results,
        };
    }
    async remove(id) {
        await this.questionService.remove(+id);
        return { message: 'Question deleted' };
    }
    async addCategory(id, categoryId) {
        await this.questionService.addCategory(+id, +categoryId);
        return { message: 'Category added' };
    }
    async removeCategory(id, categoryId) {
        await this.questionService.removeCategory(+id, +categoryId);
        return { message: 'Category remvoved' };
    }
    async toggleActive(id) {
        const results = await this.questionService.toggleActive(+id);
        return {
            message: `Question ${results ? 'activated' : 'deactivated'}`,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    (0, decorators_1.CreatedResponse)(question_entity_1.Question),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_question_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Paginated)(),
    (0, decorators_1.PageResponse)(question_entity_1.Question),
    __param(0, (0, decorators_1.PaginationParams)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, question_filter_options_dto_1.QuestionFilterOptionsDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.OkResponse)(question_entity_1.Question),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    (0, decorators_1.OkResponse)(question_entity_1.Question),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_question_dto_1.UpdateQuestionDto]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    (0, decorators_1.OkResponse)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/add-category'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.QueryParam)('categoryId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Patch)(':id/remove-category'),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.QueryParam)('categoryId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "removeCategory", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, decorators_1.OkResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "toggleActive", null);
QuestionController = __decorate([
    (0, common_1.Controller)('questions'),
    (0, swagger_1.ApiTags)('Questions'),
    (0, swagger_1.ApiExtraModels)(question_entity_1.Question, category_entity_1.Category, section_entity_1.Section),
    (0, auth_decorator_1.Auth)(),
    (0, decorators_1.ErrorResponses)(decorators_1.UnauthorizedResponse, decorators_1.ForbiddenResponse),
    __metadata("design:paramtypes", [question_service_1.QuestionService])
], QuestionController);
exports.QuestionController = QuestionController;
//# sourceMappingURL=question.controller.js.map