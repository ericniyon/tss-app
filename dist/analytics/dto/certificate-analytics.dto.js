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
exports.CertificateRowDto = exports.CertificateAnalyticsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class statusPercentages {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], statusPercentages.prototype, "granted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], statusPercentages.prototype, "pendingPayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], statusPercentages.prototype, "expired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], statusPercentages.prototype, "revoked", void 0);
class PaymentByDate {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PaymentByDate.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaymentByDate.prototype, "expected", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaymentByDate.prototype, "actual", void 0);
class CategoryPercentage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CategoryPercentage.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CategoryPercentage.prototype, "percentage", void 0);
class RateByDate {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RateByDate.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RateByDate.prototype, "all", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RateByDate.prototype, "granted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RateByDate.prototype, "revoked", void 0);
class CertificateAnalyticsDto {
    constructor() {
        this.categoryPercentages = [];
        this.paymentsByDate = [];
        this.ratesByDate = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CertificateAnalyticsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CertificateAnalyticsDto.prototype, "totalGranted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CertificateAnalyticsDto.prototype, "totalPending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CertificateAnalyticsDto.prototype, "expectedIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CertificateAnalyticsDto.prototype, "actualIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: CategoryPercentage }),
    __metadata("design:type", Array)
], CertificateAnalyticsDto.prototype, "categoryPercentages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: PaymentByDate }),
    __metadata("design:type", Array)
], CertificateAnalyticsDto.prototype, "paymentsByDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: RateByDate }),
    __metadata("design:type", Array)
], CertificateAnalyticsDto.prototype, "ratesByDate", void 0);
exports.CertificateAnalyticsDto = CertificateAnalyticsDto;
class CertificateRowDto {
}
exports.CertificateRowDto = CertificateRowDto;
//# sourceMappingURL=certificate-analytics.dto.js.map