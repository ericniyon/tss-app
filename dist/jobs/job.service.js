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
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const enums_1 = require("../certificate/enums");
const sendgrid_service_1 = require("../notification/sendgrid.service");
const certificate_expire_reminder_1 = require("../shared/templates/certificate-expire-reminder");
const reminderDate_1 = require("../shared/utils/reminderDate");
let JobService = class JobService {
    constructor(certificateRepo, sendgridService, configService, connection) {
        this.certificateRepo = certificateRepo;
        this.sendgridService = sendgridService;
        this.configService = configService;
        this.connection = connection;
    }
    async handleCertificateCron() {
        const certificates = await this.certificateRepo.find({
            relations: ['application', 'application.applicant'],
        });
        const applicants = [];
        certificates.forEach((c) => {
            if (c.status == enums_1.ECertificateStatus.GRANTED &&
                (0, reminderDate_1.compareDate)(c.expirationDate)) {
                applicants.push(c.application.applicant.email);
            }
        });
        if (applicants.length > 0) {
            const updateEmail = {
                to: applicants,
                subject: 'Trust seal certificate update.',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello applicant, your certificate is about to expire`,
                html: (0, certificate_expire_reminder_1.CertificateExpireReminderTemplate)('is about to expire'),
            };
            this.sendgridService.sendMultiple(updateEmail);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(process.env.CRON_EXPRESSION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobService.prototype, "handleCertificateCron", null);
JobService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sendgrid_service_1.SendGridService,
        config_1.ConfigService,
        typeorm_2.Connection])
], JobService);
exports.JobService = JobService;
//# sourceMappingURL=job.service.js.map