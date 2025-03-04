"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const application_entity_1 = require("../application/entities/application.entity");
const sendgrid_service_1 = require("../notification/sendgrid.service");
const payment_entity_1 = require("../payment/entities/payment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const certificate_controller_1 = require("./certificate.controller");
const certificate_service_1 = require("./certificate.service");
const certificate_entity_1 = require("./entities/certificate.entity");
let CertificateModule = class CertificateModule {
};
CertificateModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([certificate_entity_1.Certificate, application_entity_1.Application, payment_entity_1.Payment, user_entity_1.User]),
        ],
        controllers: [certificate_controller_1.CertificateController],
        providers: [certificate_service_1.CertificateService, sendgrid_service_1.SendGridService, config_1.ConfigService],
        exports: [certificate_service_1.CertificateService],
    })
], CertificateModule);
exports.CertificateModule = CertificateModule;
//# sourceMappingURL=certificate.module.js.map