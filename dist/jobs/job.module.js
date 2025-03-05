"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const sendgrid_service_1 = require("../notification/sendgrid.service");
const job_service_1 = require("./job.service");
let JobModule = class JobModule {
};
JobModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([certificate_entity_1.Certificate]),
            schedule_1.ScheduleModule.forRoot(),
        ],
        providers: [job_service_1.JobService, sendgrid_service_1.SendGridService, config_1.ConfigService],
    })
], JobModule);
exports.JobModule = JobModule;
//# sourceMappingURL=job.module.js.map