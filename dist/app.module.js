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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const analytics_module_1 = require("./analytics/analytics.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const application_module_1 = require("./application/application.module");
const auth_module_1 = require("./auth/auth.module");
const category_module_1 = require("./category/category.module");
const certificate_module_1 = require("./certificate/certificate.module");
const job_module_1 = require("./jobs/job.module");
const notification_module_1 = require("./notification/notification.module");
const question_module_1 = require("./question/question.module");
const section_module_1 = require("./section/section.module");
const app_config_1 = require("./shared/config/app.config");
const typeorm_factory_config_service_1 = require("./shared/config/typeorm-factory-config.service");
const database_exception_filter_1 = require("./shared/filters/database-exception.filter");
const global_exception_filter_1 = require("./shared/filters/global-exception.filter");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const audit_interceptor_1 = require("./shared/interceptors/audit.interceptor");
const response_transform_interceptor_1 = require("./shared/interceptors/response-transform.interceptor");
const application_seed_service_1 = require("./shared/seed/application.seed-service");
const category_seed_service_1 = require("./shared/seed/category.seed-service");
const question_seed_service_1 = require("./shared/seed/question.seed-service");
const section_seed_service_1 = require("./shared/seed/section.seed-service");
const user_seed_service_1 = require("./shared/seed/user.seed-service");
const env_util_1 = require("./shared/utils/env.util");
const PasswordEncryption_1 = require("./shared/utils/PasswordEncryption");
const users_module_1 = require("./users/users.module");
const payment_module_1 = require("./payment/payment.module");
const subcategory_module_1 = require("./subcategory/subcategory.module");
const subsection_module_1 = require("./subsection/subsection.module");
let AppModule = class AppModule {
    constructor(userSeedService, categorySeedService, sectionSeedService, questionSeedService, applicationSeedService) {
        this.userSeedService = userSeedService;
        this.categorySeedService = categorySeedService;
        this.sectionSeedService = sectionSeedService;
        this.questionSeedService = questionSeedService;
        this.applicationSeedService = applicationSeedService;
    }
    async onApplicationBootstrap() {
        await this.userSeedService.seed();
        await this.sectionSeedService.seed();
        if ((0, env_util_1.isRunningInDevelopment)()) {
            await this.categorySeedService.seed();
            await this.questionSeedService.seed();
            await this.applicationSeedService.seed();
        }
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.runtimeConfig],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useClass: typeorm_factory_config_service_1.TypeOrmFactoryConfigService,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            category_module_1.CategoryModule,
            section_module_1.SectionModule,
            question_module_1.QuestionModule,
            application_module_1.ApplicationModule,
            certificate_module_1.CertificateModule,
            notification_module_1.NotificationModule,
            job_module_1.JobModule,
            analytics_module_1.AnalyticsModule,
            payment_module_1.PaymentModule,
            subcategory_module_1.SubcategoryModule,
            subsection_module_1.SubsectionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            { provide: core_1.APP_FILTER, useClass: global_exception_filter_1.GlobalExceptionFilter },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
            { provide: core_1.APP_FILTER, useClass: database_exception_filter_1.DatabaseExceptionFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: audit_interceptor_1.AuditInterceptor },
            { provide: core_1.APP_INTERCEPTOR, useClass: response_transform_interceptor_1.ResponseTransformInterceptor },
            { provide: core_1.APP_INTERCEPTOR, useClass: common_1.ClassSerializerInterceptor },
            app_service_1.AppService,
            user_seed_service_1.UserSeedService,
            question_seed_service_1.QuestionSeedService,
            category_seed_service_1.CategorySeedService,
            section_seed_service_1.SectionSeedService,
            application_seed_service_1.ApplicationSeedService,
            PasswordEncryption_1.PasswordEncryption,
        ],
    }),
    __metadata("design:paramtypes", [user_seed_service_1.UserSeedService,
        category_seed_service_1.CategorySeedService,
        section_seed_service_1.SectionSeedService,
        question_seed_service_1.QuestionSeedService,
        application_seed_service_1.ApplicationSeedService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map