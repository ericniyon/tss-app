"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const certificate_module_1 = require("../certificate/certificate.module");
const category_entity_1 = require("../category/entities/category.entity");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const sendgrid_service_1 = require("../notification/sendgrid.service");
const question_entity_1 = require("../question/entities/question.entity");
const section_entity_1 = require("../section/entities/section.entity");
const user_entity_1 = require("../users/entities/user.entity");
const application_controller_1 = require("./application.controller");
const application_service_1 = require("./application.service");
const answer_entity_1 = require("./entities/answer.entity");
const application_entity_1 = require("./entities/application.entity");
let ApplicationModule = class ApplicationModule {
};
ApplicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                application_entity_1.Application,
                answer_entity_1.Answer,
                question_entity_1.Question,
                category_entity_1.Category,
                section_entity_1.Section,
                user_entity_1.User,
                certificate_entity_1.Certificate,
            ]),
            certificate_module_1.CertificateModule,
        ],
        controllers: [application_controller_1.ApplicationController],
        providers: [application_service_1.ApplicationService, sendgrid_service_1.SendGridService, config_1.ConfigService],
        exports: [application_service_1.ApplicationService],
    })
], ApplicationModule);
exports.ApplicationModule = ApplicationModule;
//# sourceMappingURL=application.module.js.map