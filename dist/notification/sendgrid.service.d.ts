import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import 'dotenv/config';
export declare class SendGridService {
    private readonly configService;
    constructor(configService: ConfigService);
    send(mail: SendGrid.MailDataRequired): Promise<[SendGrid.ClientResponse, {}]>;
    sendMultiple(mail: SendGrid.MailDataRequired): Promise<[SendGrid.ClientResponse, {}]>;
}
