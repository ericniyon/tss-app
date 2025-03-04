import { ConfigService } from '@nestjs/config';
import { Connection, Repository } from 'typeorm';
import { Certificate } from '../certificate/entities/certificate.entity';
import { SendGridService } from '../notification/sendgrid.service';
export declare class JobService {
    private readonly certificateRepo;
    private sendgridService;
    private configService;
    private readonly connection;
    constructor(certificateRepo: Repository<Certificate>, sendgridService: SendGridService, configService: ConfigService, connection: Connection);
    handleCertificateCron(): Promise<void>;
}
