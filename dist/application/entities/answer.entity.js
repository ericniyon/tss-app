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
exports.Answer = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const question_entity_1 = require("../../question/entities/question.entity");
const base_entity_1 = require("../../shared/interfaces/base.entity");
const enums_1 = require("../enums");
const application_entity_1 = require("./application.entity");
let Answer = class Answer extends base_entity_1.default {
};
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Answer.prototype, "questionText", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Answer.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Answer.prototype, "responses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.replaceAll('_', ' ')),
    __metadata("design:type", String)
], Answer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Answer.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => application_entity_1.Application, (application) => application.answers),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", application_entity_1.Application)
], Answer.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (question) => question.answers),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", question_entity_1.Question)
], Answer.prototype, "question", void 0);
Answer = __decorate([
    (0, typeorm_1.Entity)('answers')
], Answer);
exports.Answer = Answer;
//# sourceMappingURL=answer.entity.js.map