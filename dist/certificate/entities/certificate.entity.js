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
exports.Certificate = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const application_entity_1 = require("../../application/entities/application.entity");
const base_entity_1 = require("../../shared/interfaces/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const enums_1 = require("../enums");
let Certificate = class Certificate extends base_entity_1.default {
    constructor() {
        super(...arguments);
        this.isValid = () => this.status === enums_1.ECertificateStatus.GRANTED &&
            !(this.expirationDate !== null && this.expirationDate < new Date());
        this.isExpired = () => this.expirationDate !== null && this.expirationDate < new Date();
    }
};
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Certificate.prototype, "uniqueId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: enums_1.ECertificateStatus.PENDING_PAYMENT }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.replace(/_/g, ' ')),
    __metadata("design:type", String)
], Certificate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => application_entity_1.Application, (application) => application.certificate),
    (0, swagger_1.ApiProperty)({ type: () => application_entity_1.Application }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", application_entity_1.Application)
], Certificate.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Certificate.prototype, "assignees", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Certificate.prototype, "expirationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Certificate.prototype, "grantedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Certificate.prototype, "isRenewing", void 0);
Certificate = __decorate([
    (0, typeorm_1.Entity)('certificates')
], Certificate);
exports.Certificate = Certificate;
//# sourceMappingURL=certificate.entity.js.map