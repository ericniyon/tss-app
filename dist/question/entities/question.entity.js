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
exports.Question = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../category/entities/category.entity");
const section_entity_1 = require("../../section/entities/section.entity");
const base_entity_1 = require("../../shared/interfaces/base.entity");
const enums_1 = require("../enums");
const subsection_entity_1 = require("../../subsection/entities/subsection.entity");
const subcategory_entity_1 = require("../../subcategory/entities/subcategory.entity");
let Question = class Question extends base_entity_1.default {
};
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Question.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Question.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Question.prototype, "requiresAttachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Question.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Question.prototype, "possibleAnswers", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Question.prototype, "hasBeenAsked", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => section_entity_1.Section),
    (0, swagger_1.ApiProperty)({ type: section_entity_1.Section }),
    __metadata("design:type", section_entity_1.Section)
], Question.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category),
    (0, typeorm_1.JoinTable)({ name: 'questions_categories' }),
    __metadata("design:type", Array)
], Question.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subsection_entity_1.Subsection),
    (0, swagger_1.ApiProperty)({ type: subsection_entity_1.Subsection }),
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    __metadata("design:type", subsection_entity_1.Subsection)
], Question.prototype, "subsection", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subcategory_entity_1.Subcategory),
    (0, swagger_1.ApiProperty)({ type: subcategory_entity_1.Subcategory }),
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    __metadata("design:type", subcategory_entity_1.Subcategory)
], Question.prototype, "subcategory", void 0);
Question = __decorate([
    (0, typeorm_1.Entity)('questions')
], Question);
exports.Question = Question;
//# sourceMappingURL=question.entity.js.map