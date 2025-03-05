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
exports.CategoryRowDto = exports.ApplicationRowDto = exports.ApplicationAnalyticsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class StatusPercentage {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StatusPercentage.prototype, "pending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StatusPercentage.prototype, "firstStagePassed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StatusPercentage.prototype, "approved", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StatusPercentage.prototype, "denied", void 0);
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
], RateByDate.prototype, "accepted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RateByDate.prototype, "denied", void 0);
class ApplicationAnalyticsDto {
    constructor() {
        this.categoryPercentages = [];
        this.paymentsByDate = [];
        this.ratesByDate = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ApplicationAnalyticsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ApplicationAnalyticsDto.prototype, "totalApproved", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ApplicationAnalyticsDto.prototype, "totalPending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ApplicationAnalyticsDto.prototype, "expectedIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ApplicationAnalyticsDto.prototype, "actualIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: CategoryPercentage }),
    __metadata("design:type", Array)
], ApplicationAnalyticsDto.prototype, "categoryPercentages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", StatusPercentage)
], ApplicationAnalyticsDto.prototype, "statusPercentages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: PaymentByDate }),
    __metadata("design:type", Array)
], ApplicationAnalyticsDto.prototype, "paymentsByDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: RateByDate }),
    __metadata("design:type", Array)
], ApplicationAnalyticsDto.prototype, "ratesByDate", void 0);
exports.ApplicationAnalyticsDto = ApplicationAnalyticsDto;
class ApplicationRowDto {
}
exports.ApplicationRowDto = ApplicationRowDto;
class CategoryRowDto {
}
exports.CategoryRowDto = CategoryRowDto;
//# sourceMappingURL=application-analytics.dto.js.map