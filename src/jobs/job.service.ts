import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Certificate } from '../certificate/entities/certificate.entity';
import { ECertificateStatus } from '../certificate/enums';
import { SendGridService } from '../notification/sendgrid.service';
import { CertificateExpireReminderTemplate } from '../shared/templates/certificate-expire-reminder';
import { compareDate } from '../shared/utils/reminderDate';

const cronExpression =
    process.env.CRON_EXPRESSION && process.env.CRON_EXPRESSION.trim().length > 0
        ? process.env.CRON_EXPRESSION
        : '0 0 * * *';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(Certificate)
        private readonly certificateRepo: Repository<Certificate>,
        private sendgridService: SendGridService,
        private configService: ConfigService,

        private readonly connection: Connection,
    ) {}
    @Cron(cronExpression)
    async handleCertificateCron(): Promise<void> {
        const certificates = await this.certificateRepo.find({
            relations: ['application', 'application.applicant'],
        });
        const applicants = [];
        certificates.forEach((c) => {
            if (
                c.status == ECertificateStatus.GRANTED &&
                compareDate(c.expirationDate)
            ) {
                applicants.push(c.application.applicant.email);
            }
        });
        if (applicants.length > 0) {
            const updateEmail = {
                to: applicants,
                subject: 'Trust seal certificate update.',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello applicant, your certificate is about to expire`,
                html: CertificateExpireReminderTemplate('is about to expire'),
            };
            this.sendgridService.sendMultiple(updateEmail);
        }
    }
}
