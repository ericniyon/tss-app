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
exports.CommonFilterOptionsDto = void 0;
const class_transformer_1 = require("class-transformer");
const decorators_1 = require("../decorators");
const enums_1 = require("../enums");
const date_util_1 = require("../utils/date.util");
class CommonFilterOptionsDto {
}
__decorate([
    (0, decorators_1.OptionalProperty)({
        example: new Date(new Date().setDate(new Date().getDate() - 7))
            .toISOString()
            .split('T')[0],
    }),
    (0, class_transformer_1.Transform)(({ value }) => (0, date_util_1.parseDate)(value)),
    __metadata("design:type", Date)
], CommonFilterOptionsDto.prototype, "dateFrom", void 0);
__decorate([
    (0, decorators_1.OptionalProperty)({
        default: new Date().toISOString().split('T')[0],
    }),
    (0, class_transformer_1.Transform)(({ value }) => (0, date_util_1.parseDate)(value)),
    __metadata("design:type", Date)
], CommonFilterOptionsDto.prototype, "dateTo", void 0);
__decorate([
    (0, decorators_1.OptionalProperty)(),
    __metadata("design:type", String)
], CommonFilterOptionsDto.prototype, "search", void 0);
__decorate([
    (0, decorators_1.OptionalProperty)({ enum: enums_1.ESort }),
    __metadata("design:type", String)
], CommonFilterOptionsDto.prototype, "sort", void 0);
exports.CommonFilterOptionsDto = CommonFilterOptionsDto;
//# sourceMappingURL=common-filter-options.dto.js.map