import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../application/entities/application.entity';
import { ApplicationSnapshot } from '../application/entities/application-snapshot.entity';
import { SendGridService } from '../notification/sendgrid.service';
import { Payment } from '../payment/entities/payment.entity';
import { Subcategory } from '../subcategory/entities/subcategory.entity';
import { User } from '../users/entities/user.entity';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { Certificate } from './entities/certificate.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Certificate,
            Application,
            ApplicationSnapshot,
            Payment,
            User,
            Subcategory,
        ]),
    ],
    controllers: [CertificateController],
    providers: [CertificateService, SendGridService, ConfigService],
    exports: [CertificateService],
})
export class CertificateModule {}
