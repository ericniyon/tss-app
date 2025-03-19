import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateModule } from '../certificate/certificate.module';
import { Category } from '../category/entities/category.entity';
import { CertificateService } from '../certificate/certificate.service';
import { Certificate } from '../certificate/entities/certificate.entity';
import { SendGridService } from '../notification/sendgrid.service';
import { Question } from '../question/entities/question.entity';
import { Section } from '../section/entities/section.entity';
import { User } from '../users/entities/user.entity';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Answer } from './entities/answer.entity';
import { Application } from './entities/application.entity';
import { Subcategory } from '../subcategory/entities/subcategory.entity';
import { Subsection } from '../subsection/entities/subsection.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Application,
            Answer,
            Question,
            Category,
            Section,
            User,
            Certificate,
            Subcategory,
            Subsection,
        ]),
        CertificateModule,
    ],
    controllers: [ApplicationController],
    providers: [ApplicationService, SendGridService, ConfigService],
    exports: [ApplicationService],
})
export class ApplicationModule {}
