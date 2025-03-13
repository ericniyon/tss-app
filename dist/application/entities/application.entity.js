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
exports.Application = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const certificate_entity_1 = require("../../certificate/entities/certificate.entity");
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../category/entities/category.entity");
const base_entity_1 = require("../../shared/interfaces/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const enums_1 = require("../enums");
const answer_entity_1 = require("./answer.entity");
let Application = class Application extends base_entity_1.default {
};
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Application.prototype, "companyUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: enums_1.EApplicationStatus.PENDING }),
    (0, class_transformer_1.Transform)(({ value }) => {
        var _a;
        return (_a = (value === 'GRANTED' ? enums_1.EApplicationStatus.APPROVED : value)) === null || _a === void 0 ? void 0 : _a.replace(/_/g, ' ');
    }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => answer_entity_1.Answer, (answer) => answer.application),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Application.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", user_entity_1.User)
], Application.prototype, "applicant", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Application.prototype, "assignees", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", category_entity_1.Category)
], Application.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Application.prototype, "completed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Application.prototype, "businessPlatform", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Application.prototype, "setupFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Application.prototype, "subscriptionFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Application.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => certificate_entity_1.Certificate, (certificate) => certificate.application),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", certificate_entity_1.Certificate)
], Application.prototype, "certificate", void 0);
Application = __decorate([
    (0, typeorm_1.Entity)('applications')
], Application);
exports.Application = Application;
//# sourceMappingURL=application.entity.js.map