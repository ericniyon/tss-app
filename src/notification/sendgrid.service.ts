import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import 'dotenv/config';

@Injectable()
export class SendGridService {
    constructor(private readonly configService: ConfigService) {
        SendGrid.setApiKey(this.configService.get('sendgrid').apiKey);
    }

    async send(mail: SendGrid.MailDataRequired) {
        try {
            return await SendGrid.send(mail);
        } catch (error) {
            Logger.error(error);
        }
    }

    async sendMultiple(mail: SendGrid.MailDataRequired) {
        try {
            return await SendGrid.sendMultiple(mail);
        } catch (error) {
            Logger.error(error);
        }
    }
}
