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
exports.ApplicationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const question_entity_1 = require("../question/entities/question.entity");
const decorators_1 = require("../shared/decorators");
const user_entity_1 = require("../users/entities/user.entity");
const application_service_1 = require("./application.service");
const add_assignees_dto_1 = require("./dto/add-assignees.dto");
const application_filter_options_dto_1 = require("./dto/application-filter-options.dto");
const application_response_dto_1 = require("./dto/application-response.dto");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_answer_status_dto_1 = require("./dto/update-answer-status.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
const update_application_status_dto_1 = require("./dto/update-application-status.dto");
const application_entity_1 = require("./entities/application.entity");
const roles_enum_1 = require("../shared/enums/roles.enum");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const file_util_1 = require("../shared/utils/file.util");
let ApplicationController = class ApplicationController {
    constructor(applicationService) {
        this.applicationService = applicationService;
    }
    async create(createApplicationDto, user) {
        const results = await this.applicationService.create(createApplicationDto, user);
        return { message: 'Application created successfully', results };
    }
    async findAll(user, options, filterOptions) {
        const results = await this.applicationService.findAll(user, options, filterOptions);
        return { message: 'Applications retrieved successfully', results };
    }
    async findLatestPending(user) {
        return {
            message: 'Application retrieved successfully',
            results: await this.applicationService.findLatestPending(user),
        };
    }
    async findCurrentApplicationOrCertificate(user) {
        return {
            message: 'Application status retrieved successfully',
            results: await this.applicationService.findCurrentApplicationOrCertificate(user),
        };
    }
    async findQuestions(categoryId) {
        return {
            message: 'Questions retrieved successfully',
            results: await this.applicationService.findQuestions(+categoryId),
        };
    }
    async exportAllAnswers(categoryId, year, res) {
        const { fileName, buffer } = await this.applicationService.exportAllAnswersToExcel(+categoryId, +year);
        const stream = (0, file_util_1.createReadableStream)(buffer);
        res.set({
            'Content-Type': 'application/vnd.openxmlIdformats-officedocument.spreadsheetml.sheet',
            'Content-Length': buffer.length,
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });
        stream.pipe(res);
        return {
            message: 'Answers downloaded',
        };
    }
    async joinInterview(applicationId, user) {
        await this.applicationService.joinInterview(applicationId, user);
        return { message: 'Successfully joined interview' };
    }
    async findOne(id) {
        return {
            message: 'Application retrieved successfully',
            results: await this.applicationService.findOne({
                where: { id: +id },
            }),
        };
    }
    async updateStatus(id, updateStatusDto) {
        return {
            message: 'Application updated successfully',
            results: await this.applicationService.updateStatus(+id, updateStatusDto.status, updateStatusDto.setupFee, updateStatusDto.subscriptionFee),
        };
    }
    async updateAnswerStatus(id, updateAnswerStatusDto) {
        await this.applicationService.updateAnswerStatus(+id, updateAnswerStatusDto.status);
        return { message: 'Status updated successfully' };
    }
    async reviewAnswers(id, dto) {
        await this.applicationService.reviewAnswers(+id, dto);
        return { message: 'Answers updated successfully' };
    }
    async update(id, updateApplicationDto, user) {
        const results = await this.applicationService.update(+id, updateApplicationDto, user);
        return {
            message: 'Application updated successfully',
            results,
        };
    }
    async addAssignees(id, addAssigneesDto) {
        const results = await this.applicationService.addAssignees(+id, addAssigneesDto);
        return {
            message: 'Assignee added successfully',
            results,
        };
    }
    async removeAssignee(id, assigneeId) {
        const results = await this.applicationService.removeAssignee(+id, +assigneeId);
        return {
            message: 'Assignee removed successfully',
            results,
        };
    }
    async submitApplication(id, user) {
        await this.applicationService.submit(+id, user);
        return { message: 'Application submitted successfully' };
    }
    async remove(id) {
        await this.applicationService.remove(+id);
        return {
            message: 'Application deleted',
        };
    }
    async findDeniedAnswers(id) {
        return {
            message: 'Application retrieved successfully',
            results: await this.applicationService.findDeniedAnswers(+id),
        };
    }
};
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Post)(),
    (0, decorators_1.CreatedResponse)(application_entity_1.Application),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_application_dto_1.CreateApplicationDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "create", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)(),
    (0, decorators_1.Paginated)(),
    (0, decorators_1.PageResponse)(application_entity_1.Application),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, decorators_1.PaginationParams)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, application_filter_options_dto_1.ApplicationFilterOptionsDto]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "findAll", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('latest-pending'),
    (0, decorators_1.OkResponse)(application_entity_1.Application),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "findLatestPending", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('current'),
    (0, decorators_1.OkResponse)(application_entity_1.Application),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "findCurrentApplicationOrCertificate", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)('/questions'),
    (0, decorators_1.QueryParam)('category', true),
    (0, decorators_1.OkArrayResponse)(question_entity_1.Question),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "findQuestions", null);
__decorate([
    (0, common_1.Get)('export-answers'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "exportAllAnswers", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Post)('join-interview'),
    (0, decorators_1.OkResponse)(),
    __param(0, (0, common_1.Body)('applicationId', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "joinInterview", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)(':id'),
    (0, decorators_1.OkResponse)(application_response_dto_1.ApplicationResponseDto),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, decorators_1.OkResponse)(application_entity_1.Application),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_status_dto_1.UpdateApplicationStatusDto]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)('answers/:id/status'),
    (0, decorators_1.OkResponse)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_answer_status_dto_1.UpdateAnswerStatusDto]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "updateAnswerStatus", null);
__decorate([
    (0, common_1.Patch)(':id/review'),
    (0, decorators_1.OkResponse)(),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_answer_status_dto_1.ReviewAnswersDto]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "reviewAnswers", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.OkResponse)(application_entity_1.Application),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_dto_1.UpdateApplicationDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/add-assignee'),
    (0, decorators_1.OkResponse)(application_entity_1.Application),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_assignees_dto_1.AddAssigneesDto]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "addAssignees", null);
__decorate([
    (0, common_1.Patch)(':id/remove-assignee'),
    (0, decorators_1.OkResponse)(application_entity_1.Application),
    (0, decorators_1.QueryParam)('assigneeId'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('assigneeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "removeAssignee", null);
__decorate([
    (0, common_1.Patch)(':id/submit'),
    (0, decorators_1.OkResponse)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "submitApplication", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.OkResponse)(),
    (0, roles_decorator_1.Role)(roles_enum_1.Roles.DBI_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/denied-answers'),
    (0, decorators_1.OkResponse)(application_response_dto_1.ApplicationResponseDto),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "findDeniedAnswers", null);
ApplicationController = __decorate([
    (0, common_1.Controller)('applications'),
    (0, swagger_1.ApiTags)('Applications'),
    (0, swagger_1.ApiExtraModels)(application_entity_1.Application, question_entity_1.Question, application_response_dto_1.ApplicationResponseDto),
    __metadata("design:paramtypes", [application_service_1.ApplicationService])
], ApplicationController);
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map