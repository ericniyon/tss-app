import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class PindoService {
    private configService;
    private readonly http;
    constructor(configService: ConfigService, http: HttpService);
    send(phoneNumber: string, message: string): Promise<void>;
}
