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
exports.ReviewAnswersDto = exports.UpdateAnswerStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../shared/decorators");
const enums_1 = require("../enums");
class UpdateAnswerStatusDto {
}
__decorate([
    (0, decorators_1.OptionalProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateAnswerStatusDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.EAnswerStatus }),
    (0, class_validator_1.IsEnum)(enums_1.EAnswerStatus),
    __metadata("design:type", String)
], UpdateAnswerStatusDto.prototype, "status", void 0);
__decorate([
    (0, decorators_1.OptionalProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAnswerStatusDto.prototype, "feedback", void 0);
exports.UpdateAnswerStatusDto = UpdateAnswerStatusDto;
class ReviewAnswersDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => UpdateAnswerStatusDto }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateAnswerStatusDto),
    __metadata("design:type", Array)
], ReviewAnswersDto.prototype, "answers", void 0);
exports.ReviewAnswersDto = ReviewAnswersDto;
//# sourceMappingURL=update-answer-status.dto.js.map