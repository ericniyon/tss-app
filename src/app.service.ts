import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from './notification/sendgrid.service';
import { NotificationEmailTemplate } from './shared/templates/notification-email';

@Injectable()
export class AppService {
    constructor(
        private readonly sendGridService: SendGridService,
        private readonly configService: ConfigService,
    ) {}

    getHello(): any {
        return {
            message: 'Welcome to Trust seal system API',
        };
    }

    async sendTestEmail(email: string): Promise<any> {
        const testEmail = {
            to: email,
            subject: 'Test Email from Trust Seal System',
            from: this.configService.get('sendgrid').fromEmail,
            text: 'This is a test email from the Trust Seal System API.',
            html: NotificationEmailTemplate(
                'This is a test email from the Trust Seal System API. If you received this email, the email service is working correctly!',
            ),
        };

        try {
            const result = await this.sendGridService.send(testEmail);
            return {
                message: 'Test email sent successfully',
                email: email,
                result: result,
            };
        } catch (error) {
            return {
                message: 'Failed to send test email',
                email: email,
                error: error.message,
            };
        }
    }
}
