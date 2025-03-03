import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class PindoService {
    constructor(
        private configService: ConfigService,
        private readonly http: HttpService,
    ) {}

    async send(phoneNumber: string, message: string): Promise<void> {
        try {
            const data = {
                to: phoneNumber,
                text: message,
                sender: 'DBI',
            };
            await lastValueFrom(
                this.http
                    .post(`${this.configService.get('pindo').apiUrl}`, data, {
                        headers: {
                            Authorization: `Bearer ${
                                this.configService.get('pindo').apiKey
                            }`,
                        },
                    })
                    .pipe(
                        map((response) => {
                            return response.data;
                        }),
                    ),
            );
        } catch (error) {
            Logger.error(error);
            Logger.error('Failed to send the sms to the user phone number');
        }
    }
}
