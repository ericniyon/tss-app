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
exports.AuthOtp = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../shared/interfaces/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let AuthOtp = class AuthOtp extends base_entity_1.default {
};
__decorate([
    (0, typeorm_1.Column)({ name: 'otp', nullable: false }),
    __metadata("design:type", String)
], AuthOtp.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'otp_type', nullable: false }),
    __metadata("design:type", String)
], AuthOtp.prototype, "otpType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiration_time', nullable: false }),
    __metadata("design:type", Date)
], AuthOtp.prototype, "expirationTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_to', nullable: false, default: 'phone' }),
    __metadata("design:type", String)
], AuthOtp.prototype, "sentTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.otp),
    __metadata("design:type", user_entity_1.User)
], AuthOtp.prototype, "user", void 0);
AuthOtp = __decorate([
    (0, typeorm_1.Entity)()
], AuthOtp);
exports.AuthOtp = AuthOtp;
//# sourceMappingURL=auth-otp.entity.js.map