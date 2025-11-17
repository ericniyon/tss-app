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
exports.SectionFilterOptionsDto = void 0;
const enums_1 = require("../../question/enums");
const decorators_1 = require("../../shared/decorators");
const common_filter_options_dto_1 = require("../../shared/dto/common-filter-options.dto");
class SectionFilterOptionsDto extends common_filter_options_dto_1.CommonFilterOptionsDto {
}
__decorate([
    (0, decorators_1.OptionalProperty)({ enum: enums_1.EStatus }),
    __metadata("design:type", String)
], SectionFilterOptionsDto.prototype, "status", void 0);
__decorate([
    (0, decorators_1.OptionalProperty)(),
    __metadata("design:type", Number)
], SectionFilterOptionsDto.prototype, "subcategoryId", void 0);
exports.SectionFilterOptionsDto = SectionFilterOptionsDto;
//# sourceMappingURL=section-filter-options.dto.js.map