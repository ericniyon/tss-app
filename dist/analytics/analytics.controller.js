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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const decorators_1 = require("../shared/decorators");
const roles_enum_1 = require("../shared/enums/roles.enum");
const file_util_1 = require("../shared/utils/file.util");
const analytics_service_1 = require("./analytics.service");
const analytics_filter_options_dto_1 = require("./dto/analytics-filter-options.dto");
const application_analytics_dto_1 = require("./dto/application-analytics.dto");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getApplicationAnalytics(filterOptions) {
        const results = await this.analyticsService.getApplicationAnalytics(filterOptions);
        return {
            message: 'Application analytics retrieved',
            results,
        };
    }
    async getCertificateAnalytics(filterOptions) {
        const results = await this.analyticsService.getCertificateAnalytics(filterOptions);
        return {
            message: 'Certificate analytics retrieved',
            results,
        };
    }
    async downloadAnalytics(filterOptions, res) {
        const { fileName, buffer } = await this.analyticsService.downloadAnalytics(filterOptions);
        const stream = (0, file_util_1.createReadableStream)(buffer);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length': buffer.length,
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });
        stream.pipe(res);
        return {
            message: 'Analytics downloaded',
        };
    }
};
__decorate([
    (0, common_1.Get)('applications'),
    (0, decorators_1.OkResponse)(application_analytics_dto_1.ApplicationAnalyticsDto),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_filter_options_dto_1.AnalyticsFilterOptionsDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getApplicationAnalytics", null);
__decorate([
    (0, common_1.Get)('certificates'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_filter_options_dto_1.AnalyticsFilterOptionsDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCertificateAnalytics", null);
__decorate([
    (0, common_1.Get)('download'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_filter_options_dto_1.AnalyticsFilterOptionsDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "downloadAnalytics", null);
AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    (0, swagger_1.ApiTags)('Analytics'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT),
    (0, swagger_1.ApiExtraModels)(application_analytics_dto_1.ApplicationAnalyticsDto),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map