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
exports.Section = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const question_entity_1 = require("../../question/entities/question.entity");
const base_entity_1 = require("../../shared/interfaces/base.entity");
let Section = class Section extends base_entity_1.default {
};
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Section.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Section.prototype, "tips", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Section.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Section.prototype, "readonly", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_entity_1.Question, (question) => question.section, { lazy: true }),
    __metadata("design:type", Array)
], Section.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Section.prototype, "sectionCategory", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Section.prototype, "subcategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Section.prototype, "isMandatory", void 0);
Section = __decorate([
    (0, typeorm_1.Entity)('sections')
], Section);
exports.Section = Section;
//# sourceMappingURL=section.entity.js.map