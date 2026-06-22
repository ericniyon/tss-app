import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient, Mail } from 'mailtrap';
import 'dotenv/config';

@Injectable()
export class MailerService {
    private client: MailtrapClient;
    private isSandbox: boolean;

    constructor(private readonly configService: ConfigService) {
        const testInboxId = this.configService.get('mailer').testInboxId;
        this.isSandbox = !!testInboxId;
        this.client = new MailtrapClient({
            token: this.configService.get('mailer').apiToken,
            testInboxId,
        });
    }

    async send(mail: Mail) {
        try {
            return this.isSandbox
                ? await this.client.testing.send(mail)
                : await this.client.send(mail);
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async sendMultiple(mail: Mail) {
        try {
            return this.isSandbox
                ? await this.client.testing.send(mail)
                : await this.client.send(mail);
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }
}
