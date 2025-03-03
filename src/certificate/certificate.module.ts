import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../application/entities/application.entity';
import { SendGridService } from '../notification/sendgrid.service';
import { Payment } from '../payment/entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { Certificate } from './entities/certificate.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Certificate, Application, Payment, User]),
    ],
    controllers: [CertificateController],
    providers: [CertificateService, SendGridService, ConfigService],
    exports: [CertificateService],
})
export class CertificateModule {}
