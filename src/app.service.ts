import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './notification/mailtrap.service';
import { NotificationEmailTemplate } from './shared/templates/notification-email';

@Injectable()
export class AppService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    getHello(): any {
        return {
            message: 'Welcome to Trust seal system API',
        };
    }

    validateTestSecret(secret: string): void {
        const expected = this.configService.get('mailer').testEmailSecret;
        if (secret !== expected) {
            throw new UnauthorizedException('Invalid test email secret');
        }
    }

    async sendTestEmail(email: string, secret: string): Promise<any> {
        this.validateTestSecret(secret);
        try {
            const results = await this.mailerService.send({
                to: [{ email }],
                subject: 'Test Email from Trust Seal System',
                from: { email: this.configService.get('mailer').fromEmail },
                text: 'This is a test email from the Trust Seal System API.',
                html: NotificationEmailTemplate(
                    'This is a test email from the Trust Seal System API. If you received this email, the email service is working correctly!',
                ),
            });
            return {
                message: 'Test email sent successfully',
                results: { email, ...results },
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            return {
                message: 'Failed to send test email',
                results: { email, error: error.message },
            };
        }
    }

    async sendTestEmailBulk(emails: string[], secret: string): Promise<any> {
        this.validateTestSecret(secret);
        try {
            const results = await this.mailerService.send({
                to: emails.map((email) => ({ email })),
                subject: 'Test Email from Trust Seal System',
                from: { email: this.configService.get('mailer').fromEmail },
                text: 'This is a test email from the Trust Seal System API.',
                html: NotificationEmailTemplate(
                    'This is a test email from the Trust Seal System API. If you received this email, the email service is working correctly!',
                ),
            });
            return {
                message: `Test email sent to ${emails.length} recipient(s)`,
                results: { emails, ...results },
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            return {
                message: 'Failed to send bulk test email',
                results: { emails, error: error.message },
            };
        }
    }
}
