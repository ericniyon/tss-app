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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../application/enums");
const category_entity_1 = require("../../category/entities/category.entity");
const base_entity_1 = require("../../shared/interfaces/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const enums_2 = require("../enums");
let Notification = class Notification extends base_entity_1.default {
};
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Notification.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", category_entity_1.Category)
], Notification.prototype, "targetCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Notification.prototype, "targetApplicationStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Notification.prototype, "targetPlatform", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.notifications),
    (0, typeorm_1.JoinTable)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Notification.prototype, "targetUsers", void 0);
Notification = __decorate([
    (0, typeorm_1.Entity)('notifications')
], Notification);
exports.Notification = Notification;
//# sourceMappingURL=notification.entity.js.map