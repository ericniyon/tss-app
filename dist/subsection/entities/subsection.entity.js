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
exports.Subsection = void 0;
const swagger_1 = require("@nestjs/swagger");
const section_entity_1 = require("../../section/entities/section.entity");
const base_entity_1 = require("../../shared/interfaces/base.entity");
const typeorm_1 = require("typeorm");
let Subsection = class Subsection extends base_entity_1.default {
};
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Subsection.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => section_entity_1.Section),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Subsection.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, nullable: false }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Subsection.prototype, "active", void 0);
Subsection = __decorate([
    (0, typeorm_1.Entity)('subsections')
], Subsection);
exports.Subsection = Subsection;
//# sourceMappingURL=subsection.entity.js.map