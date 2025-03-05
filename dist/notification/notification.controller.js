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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const decorators_1 = require("../shared/decorators");
const roles_enum_1 = require("../shared/enums/roles.enum");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const notification_entity_1 = require("./entities/notification.entity");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async create(createNotificationDto) {
        return {
            message: 'Notification created successfully',
            results: await this.notificationService.create(createNotificationDto),
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.CreatedResponse)(notification_entity_1.Notification),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT),
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiExtraModels)(notification_entity_1.Notification),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map