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
exports.CreateUserAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const omit = require("lodash.omit");
const roles_enum_1 = require("../../shared/enums/roles.enum");
class CreateUserAccountDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserAccountDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserAccountDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: omit(roles_enum_1.Roles, ['COMPANY']) }),
    (0, class_validator_1.IsEnum)(omit(roles_enum_1.Roles, ['COMPANY'])),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserAccountDto.prototype, "role", void 0);
exports.CreateUserAccountDto = CreateUserAccountDto;
//# sourceMappingURL=create-user-account.dto.js.map