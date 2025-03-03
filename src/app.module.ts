import {
    ClassSerializerInterceptor,
    Module,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CertificateModule } from './certificate/certificate.module';
import { JobModule } from './jobs/job.module';
import { NotificationModule } from './notification/notification.module';
import { QuestionModule } from './question/question.module';
import { SectionModule } from './section/section.module';
import { runtimeConfig } from './shared/config/app.config';
import { TypeOrmFactoryConfigService } from './shared/config/typeorm-factory-config.service';
import { DatabaseExceptionFilter } from './shared/filters/database-exception.filter';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AuditInterceptor } from './shared/interceptors/audit.interceptor';
import { ResponseTransformInterceptor } from './shared/interceptors/response-transform.interceptor';
import { ApplicationSeedService } from './shared/seed/application.seed-service';
import { CategorySeedService } from './shared/seed/category.seed-service';
import { QuestionSeedService } from './shared/seed/question.seed-service';
import { SectionSeedService } from './shared/seed/section.seed-service';
import { UserSeedService } from './shared/seed/user.seed-service';
import { isRunningInDevelopment } from './shared/utils/env.util';
import { PasswordEncryption } from './shared/utils/PasswordEncryption';
import { UsersModule } from './users/users.module';
import { PaymentModule } from './payment/payment.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [runtimeConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmFactoryConfigService,
        }),
        AuthModule,
        UsersModule,
        CategoryModule,
        SectionModule,
        QuestionModule,
        ApplicationModule,
        CertificateModule,
        NotificationModule,
        JobModule,
        AnalyticsModule,
        PaymentModule,
    ],
    controllers: [AppController],
    providers: [
        { provide: APP_FILTER, useClass: GlobalExceptionFilter },
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_FILTER, useClass: DatabaseExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
        AppService,
        UserSeedService,
        QuestionSeedService,
        CategorySeedService,
        SectionSeedService,
        ApplicationSeedService,
        PasswordEncryption,
    ],
})
export class AppModule implements OnApplicationBootstrap {
    constructor(
        private readonly userSeedService: UserSeedService,
        private readonly categorySeedService: CategorySeedService,
        private readonly sectionSeedService: SectionSeedService,
        private readonly questionSeedService: QuestionSeedService,
        private readonly applicationSeedService: ApplicationSeedService,
    ) {}
    async onApplicationBootstrap(): Promise<void> {
        /**
         * Seed only the admin in production and seed all other users in development
         */
        await this.userSeedService.seed();
        /**
         * Seed only the General information section in production and all other sections in development
         */
        await this.sectionSeedService.seed();
        /**
         * Add all seeds in development
         */
        if (isRunningInDevelopment()) {
            await this.categorySeedService.seed();
            await this.questionSeedService.seed();
            await this.applicationSeedService.seed();
        }
    }
}
