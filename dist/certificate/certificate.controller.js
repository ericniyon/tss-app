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
exports.CertificateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const decorators_1 = require("../shared/decorators");
const roles_enum_1 = require("../shared/enums/roles.enum");
const user_entity_1 = require("../users/entities/user.entity");
const certificate_service_1 = require("./certificate.service");
const certificate_filter_options_dto_1 = require("./dto/certificate-filter-options.dto");
const certificate_response_dto_1 = require("./dto/certificate-response.dto");
const update_certificate_status_dto_1 = require("./dto/update-certificate-status.dto");
const certificate_entity_1 = require("./entities/certificate.entity");
let CertificateController = class CertificateController {
    constructor(certificateService) {
        this.certificateService = certificateService;
    }
    async findAll(user, options, filterOptions) {
        const results = await this.certificateService.findAll(user, options, filterOptions);
        return { message: 'Certificates retrieved successfully', results };
    }
    async findOne(uniqueId) {
        return {
            message: 'Certificate retrieved successfully',
            results: await this.certificateService.findCertificate(uniqueId),
        };
    }
    async updateStatus(uniqueId, updateStatusDto) {
        return {
            message: 'Certificate updated successfully',
            results: await this.certificateService.updateStatus(uniqueId, updateStatusDto.status),
        };
    }
    async renew(uniqueId) {
        return {
            message: 'Certificate updated successfully',
            results: await this.certificateService.renewCertificate(uniqueId),
        };
    }
    async renewing(uniqueId) {
        return {
            message: 'Certificate in renewing process',
            results: await this.certificateService.isRenewingCertificate(uniqueId),
        };
    }
    async applicantCertificateByName(name) {
        return {
            message: 'Certificate retrieved successfully',
            results: await this.certificateService.findCertificateByApplicantName(name),
        };
    }
    async applicantCertificateByLoggedIn(user) {
        return {
            message: 'Certificate retrieved successfully',
            results: await this.certificateService.findCertificateByLoggedApplicant(user),
        };
    }
    async updateMultCerticatesStatus(UpdateStatusDto) {
        await this.certificateService.updateMultipleStatuses(UpdateStatusDto);
        return {
            message: 'Certificates status updated successfully',
            results: null,
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Paginated)(),
    (0, decorators_1.PageResponse)(certificate_entity_1.Certificate),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, decorators_1.PaginationParams)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, certificate_filter_options_dto_1.CertificateFilterOptionsDto]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/:uniqueId/company'),
    (0, decorators_1.OkResponse)(certificate_response_dto_1.CertificateResponseDto),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('uniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':uniqueId/status'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT),
    (0, decorators_1.OkResponse)(certificate_entity_1.Certificate),
    __param(0, (0, common_1.Param)('uniqueId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_certificate_status_dto_1.UpdateCertificateStatusDto]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':uniqueId/renew'),
    (0, auth_decorator_1.Auth)(),
    (0, decorators_1.OkResponse)(certificate_entity_1.Certificate),
    __param(0, (0, common_1.Param)('uniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "renew", null);
__decorate([
    (0, common_1.Patch)(':uniqueId/renewing'),
    (0, auth_decorator_1.Auth)(),
    (0, decorators_1.OkResponse)(certificate_entity_1.Certificate),
    __param(0, (0, common_1.Param)('uniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "renewing", null);
__decorate([
    (0, common_1.Get)('/company-verification'),
    (0, decorators_1.QueryParam)('name', false),
    (0, decorators_1.OkResponse)(certificate_entity_1.Certificate),
    __param(0, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "applicantCertificateByName", null);
__decorate([
    (0, common_1.Get)('/company'),
    (0, decorators_1.OkResponse)(certificate_entity_1.Certificate),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "applicantCertificateByLoggedIn", null);
__decorate([
    (0, common_1.Patch)('/certificates-statuses'),
    (0, decorators_1.OkResponse)(certificate_entity_1.Certificate),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_certificate_status_dto_1.UpdateCertificateStatusDto]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "updateMultCerticatesStatus", null);
CertificateController = __decorate([
    (0, common_1.Controller)('certificates'),
    (0, swagger_1.ApiTags)('Certificates'),
    __metadata("design:paramtypes", [certificate_service_1.CertificateService])
], CertificateController);
exports.CertificateController = CertificateController;
//# sourceMappingURL=certificate.controller.js.map