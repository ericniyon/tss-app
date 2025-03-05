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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("../application/entities/application.entity");
const enums_1 = require("../application/enums");
const category_entity_1 = require("../category/entities/category.entity");
const notification_email_1 = require("../shared/templates/notification-email");
const notification_entity_1 = require("./entities/notification.entity");
const enums_2 = require("./enums");
const pindo_service_1 = require("./pindo.service");
const sendgrid_service_1 = require("./sendgrid.service");
let NotificationService = class NotificationService {
    constructor(notificationRepo, applicationRepo, categoryRepo, pindoService, sendgridService, configService) {
        this.notificationRepo = notificationRepo;
        this.applicationRepo = applicationRepo;
        this.categoryRepo = categoryRepo;
        this.pindoService = pindoService;
        this.sendgridService = sendgridService;
        this.configService = configService;
    }
    async create(createNotificationDto) {
        let category;
        const queryBuilder = this.applicationRepo.createQueryBuilder('application');
        queryBuilder
            .leftJoin('application.category', 'category')
            .leftJoinAndSelect('application.applicant', 'applicant');
        if (!createNotificationDto.targetUsers) {
            if (createNotificationDto.targetApplicationStatus &&
                Object.values(enums_1.EApplicationStatus).includes(createNotificationDto.targetApplicationStatus)) {
                queryBuilder.andWhere('application.status = :status', {
                    status: createNotificationDto.targetApplicationStatus,
                });
            }
            if (createNotificationDto.targetCategory) {
                category = await this.categoryRepo.findOne(createNotificationDto.targetCategory);
                if (category) {
                    queryBuilder.andWhere('category.id = :categoryId', {
                        categoryId: category.id,
                    });
                }
            }
            if (createNotificationDto.targetPlatform) {
                queryBuilder.andWhere('application.businessPlatform = :platform', {
                    platform: createNotificationDto.targetPlatform,
                });
            }
        }
        else {
            queryBuilder.andWhere('applicant.id = ANY(:userIds)', {
                userIds: [...createNotificationDto.targetUsers],
            });
        }
        const applications = await queryBuilder.getMany();
        if (!applications.length)
            throw new common_1.NotFoundException('There are no applicants to notify');
        if (createNotificationDto.type === enums_2.ENotificationType.SMS) {
            const phones = [
                ...new Set(applications
                    .map((a) => { var _a; return (_a = a.applicant) === null || _a === void 0 ? void 0 : _a.phone; })
                    .filter((a) => a)),
            ];
            await Promise.all(phones.map((phone) => this.pindoService.send(phone, createNotificationDto.message)));
        }
        else {
            const recipientEmails = [
                ...new Set(applications.map((a) => a.applicant.email).filter((a) => a)),
            ];
            await this.sendgridService.sendMultiple({
                to: recipientEmails,
                subject: `Trust seal system: ${createNotificationDto.subject || 'Notification'}`,
                from: this.configService.get('sendgrid').fromEmail,
                html: (0, notification_email_1.NotificationEmailTemplate)(createNotificationDto.message),
            });
        }
        const newNotification = Object.assign(Object.assign({}, new notification_entity_1.Notification()), { type: createNotificationDto.type, subject: createNotificationDto.subject, message: createNotificationDto.message, targetApplicationStatus: createNotificationDto.targetApplicationStatus, targetPlatform: createNotificationDto.targetPlatform, targetCategory: category });
        newNotification.targetUsers = [];
        applications.forEach((a) => {
            if (!newNotification.targetUsers.find((u) => u.id === a.applicant.id))
                newNotification.targetUsers.push(a.applicant);
        });
        return await this.notificationRepo.save(newNotification);
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        pindo_service_1.PindoService,
        sendgrid_service_1.SendGridService,
        config_1.ConfigService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map