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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("../application/entities/application.entity");
const enums_1 = require("../application/enums");
const sendgrid_service_1 = require("../notification/sendgrid.service");
const payment_entity_1 = require("../payment/entities/payment.entity");
const payment_type_enum_1 = require("../payment/enums/payment-type.enum");
const roles_enum_1 = require("../shared/enums/roles.enum");
const certificate_status_update_email_1 = require("../shared/templates/certificate-status-update.email");
const date_util_1 = require("../shared/utils/date.util");
const user_entity_1 = require("../users/entities/user.entity");
const certificate_entity_1 = require("./entities/certificate.entity");
const enums_2 = require("./enums");
let CertificateService = class CertificateService {
    constructor(certificateRepo, sendgridService, configService, appRepo, paymentRepo, userRepo) {
        this.certificateRepo = certificateRepo;
        this.sendgridService = sendgridService;
        this.configService = configService;
        this.appRepo = appRepo;
        this.paymentRepo = paymentRepo;
        this.userRepo = userRepo;
    }
    async findAll(user, options, _a) {
        var { sort } = _a, filterOptions = __rest(_a, ["sort"]);
        const queryBuilder = this.certificateRepo
            .createQueryBuilder('certificate')
            .leftJoin('certificate.application', 'application')
            .leftJoin('application.applicant', 'applicant')
            .leftJoin('application.category', 'category')
            .leftJoin('application.assignees', 'assignees')
            .addSelect([
            'application',
            'category.id',
            'category.name',
            'applicant.id',
            'applicant.name',
            'applicant.email',
            'applicant.phone',
            'assignees.id',
            'assignees.name',
        ]);
        const { actualStartDate, actualEndDate } = (0, date_util_1.getActualDateRange)(filterOptions.dateFrom, filterOptions.dateTo);
        if (actualStartDate) {
            queryBuilder.andWhere('certificate.createdAt BETWEEN :actualStartDate AND :actualEndDate', {
                actualStartDate,
                actualEndDate,
            });
        }
        if (user.role === roles_enum_1.Roles.DBI_EXPERT) {
            queryBuilder.andWhere('application.id IN (select "applicationsId" from applications_assignees_users where "usersId" = :userId)', {
                userId: user.id,
            });
        }
        else if (user.role === roles_enum_1.Roles.COMPANY) {
            queryBuilder.andWhere('applicant.id = :applicantId', {
                applicantId: user.id,
            });
        }
        if (filterOptions.categories)
            queryBuilder.andWhere(`category.id IN (:...categories)`, {
                categories: [...filterOptions.categories],
            });
        if (Object.values(enums_2.ECertificateStatus).includes(filterOptions.status) &&
            filterOptions.status !== 'EXPIRED') {
            queryBuilder.andWhere('certificate.status = :status', {
                status: filterOptions === null || filterOptions === void 0 ? void 0 : filterOptions.status,
            });
        }
        if (filterOptions.status === 'EXPIRED') {
            queryBuilder.andWhere('certificate.expirationDate < :currentDate', {
                currentDate: new Date(),
            });
        }
        if (!isNaN(filterOptions.assignee) && filterOptions.assignee) {
            queryBuilder.andWhere(':assigneeIds = assignees.id', {
                assigneeIds: filterOptions.assignee,
            });
        }
        if (filterOptions.search) {
            queryBuilder.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('applicant.name ILIKE :name', {
                    name: `%${filterOptions === null || filterOptions === void 0 ? void 0 : filterOptions.search}%`,
                }).orWhere('certificate.status ILIKE :status', {
                    status: `%${filterOptions === null || filterOptions === void 0 ? void 0 : filterOptions.search}%`,
                });
            }));
        }
        if (sort) {
            queryBuilder.orderBy(sort.split('__')[0] === 'NAME'
                ? 'applicant.name'
                : 'certificate.createdAt', sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC');
        }
        else {
            queryBuilder.orderBy('certificate.createdAt', 'DESC');
        }
        queryBuilder.getRawAndEntities();
        const { items, meta } = await (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, options);
        return Object.assign({ items }, meta);
    }
    async renewCertificate(uniqueId) {
        const certificate = await this.findOne(uniqueId);
        if (!certificate)
            throw new common_1.NotFoundException('Certificate not found');
        certificate.status = enums_2.ECertificateStatus.GRANTED;
        certificate.isRenewing = false;
        certificate.expirationDate =
            certificate.isExpired() || !certificate.expirationDate
                ? new Date('30 JUN  2025')
                : new Date('30 JUN  2025');
        const result = await this.certificateRepo.save(certificate);
        const admins = await this.userRepo.find({
            where: { activated: true, role: roles_enum_1.Roles.DBI_ADMIN },
        });
        const updateEmail = {
            to: certificate.application.applicant.email,
            cc: certificate.application.assignees.map((a) => a.email),
            bcc: admins.map((a) => a.email),
            subject: 'Trust seal certificate renewed successfully.',
            from: this.configService.get('sendgrid').fromEmail,
            text: `Hello ${certificate.application.applicant.name}, your certificate status has been updated`,
            html: (0, certificate_status_update_email_1.CertificateStatusUpdateEmailTemplate)(certificate.application.applicant, result.status, 'has been renewed.', this.configService.get('web').clientUrl),
        };
        this.sendgridService.send(updateEmail);
        return result;
    }
    async isRenewingCertificate(uniqueId) {
        const certificate = await this.findOne(uniqueId);
        const application = certificate.application;
        if (!certificate)
            throw new common_1.NotFoundException('Certificate not found');
        certificate.isRenewing = true;
        application.answers = [];
        application.status = enums_1.EApplicationStatus.PENDING;
        application.submittedAt = new Date();
        await this.appRepo.save(application);
        const result = await this.certificateRepo.save(certificate);
        return result;
    }
    async updateStatus(uniqueId, status) {
        const certificate = await this.findOne(uniqueId);
        if (!certificate)
            throw new common_1.NotFoundException('Certificate not found');
        certificate.status = status;
        await this.certificateRepo.save(certificate);
        if ([enums_2.ECertificateStatus.GRANTED, enums_2.ECertificateStatus.REVOKED].includes(certificate.status)) {
            let message;
            if (certificate.status === enums_2.ECertificateStatus.REVOKED) {
                message = `has been revoked.<br/>
            Please get in contact with our Certification expert for more details and to revalidate it again.<br/>
            Otherwise you are obliged to remove the trust seal from your website as well as all other marketing material you might be using.
`;
            }
            else if (certificate.status === enums_2.ECertificateStatus.GRANTED) {
                message = `has been fully activated and is now valid for 12 Months.<br/>

            You can download your trust seal by logging into your account.
            `;
                certificate.expirationDate = new Date("30 JUN 2025");
                certificate.grantedAt = new Date();
                await this.certificateRepo.save(certificate);
                await this.paymentRepo.save(Object.assign(Object.assign({}, new payment_entity_1.Payment()), { amount: certificate.application.subscriptionFee || 0, type: payment_type_enum_1.EPaymentType.SUBSCRIPTION_FEE, certificate }));
            }
            const admins = await this.userRepo.find({
                where: { activated: true, role: roles_enum_1.Roles.DBI_ADMIN },
            });
            const updateEmail = {
                to: certificate.application.applicant.email,
                cc: certificate.application.assignees.map((a) => a.email),
                bcc: admins.map((a) => a.email),
                subject: 'DBI Trust Seal Account Notification',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello ${certificate.application.applicant.name} Team, your certificate status has been updated`,
                html: (0, certificate_status_update_email_1.CertificateStatusUpdateEmailTemplate)(certificate.application.applicant, certificate.status, message, this.configService.get('web').clientUrl),
            };
            this.sendgridService.send(updateEmail);
        }
        return certificate;
    }
    async findCertificate(uniqueId) {
        const certificate = await this.findOne(uniqueId);
        if (!certificate)
            throw new common_1.NotFoundException('Certificate not found');
        return certificate;
    }
    async findCertificateByApplicantName(name) {
        const certificates = await this.certificateRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.application', 'application')
            .leftJoinAndSelect('application.applicant', 'applicant')
            .leftJoinAndSelect('application.category', 'category')
            .where('applicant.name ILIKE :name', {
            name: `%${name}%`,
        })
            .orderBy('application.createdAt', 'DESC')
            .getMany();
        if (certificates.length <= 0)
            throw new common_1.NotFoundException('We have no certificate with provided applicant name');
        return certificates[0];
    }
    async findCertificateByLoggedApplicant(user) {
        const certificates = await this.certificateRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.application', 'application')
            .leftJoinAndSelect('application.applicant', 'applicant')
            .leftJoinAndSelect('application.category', 'category')
            .where('applicant.id = :id', {
            id: user.id,
        })
            .orderBy('application.createdAt', 'DESC')
            .getMany();
        if (certificates.length <= 0)
            throw new common_1.NotFoundException('We have no certificate');
        return certificates[0];
    }
    async updateMultipleStatuses(updateStatusDto) {
        const certificates = await this.certificateRepo
            .createQueryBuilder('certificate')
            .where('certificate.id IN (:...ids)', {
            ids: [...updateStatusDto.certificates],
        })
            .getMany();
        if (certificates && certificates.length > 0) {
            for (const certificate of certificates) {
                await this.updateStatus(certificate.uniqueId, updateStatusDto.status);
            }
        }
    }
    async findOne(uniqueId) {
        const certificate = await this.certificateRepo.findOne({
            where: { uniqueId },
            relations: [
                'application',
                'application.applicant',
                'application.category',
                'application.assignees',
            ],
        });
        return certificate;
    }
    setExpiration(yr, date = new Date()) {
        const dt = new Date(date);
        dt.setFullYear(dt.getFullYear() + yr);
        return dt;
    }
};
CertificateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(3, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(4, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sendgrid_service_1.SendGridService,
        config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CertificateService);
exports.CertificateService = CertificateService;
//# sourceMappingURL=certificate.service.js.map