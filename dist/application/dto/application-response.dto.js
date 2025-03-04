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
exports.ApplicationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const category_entity_1 = require("../../category/entities/category.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const enums_1 = require("../enums");
class ApplicationResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApplicationResponseDto.prototype, "companyUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApplicationResponseDto.prototype, "feedback", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApplicationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", user_entity_1.User)
], ApplicationResponseDto.prototype, "applicant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ApplicationResponseDto.prototype, "assignees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", category_entity_1.Category)
], ApplicationResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ApplicationResponseDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ApplicationResponseDto.prototype, "submittedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ApplicationResponseDto.prototype, "sections", void 0);
exports.ApplicationResponseDto = ApplicationResponseDto;
//# sourceMappingURL=application-response.dto.js.map