import { Repository } from 'typeorm';
import { Application } from '../application/entities/application.entity';
import { Certificate } from '../certificate/entities/certificate.entity';
import { Payment } from '../payment/entities/payment.entity';
import { AnalyticsFilterOptionsDto } from './dto/analytics-filter-options.dto';
import { ApplicationAnalyticsDto } from './dto/application-analytics.dto';
import { CertificateAnalyticsDto } from './dto/certificate-analytics.dto';
export declare class AnalyticsService {
    private readonly certificateRepo;
    private readonly applicationRepo;
    private readonly paymentRepo;
    constructor(certificateRepo: Repository<Certificate>, applicationRepo: Repository<Application>, paymentRepo: Repository<Payment>);
    getApplicationAnalytics(filterOptions: AnalyticsFilterOptionsDto): Promise<ApplicationAnalyticsDto>;
    getCertificateAnalytics(filterOptions: AnalyticsFilterOptionsDto): Promise<CertificateAnalyticsDto>;
    calcutateCertificateInPercentages(totalPerStatus: number, total: number): number;
    downloadAnalytics(filterOptions: AnalyticsFilterOptionsDto): Promise<{
        fileName: string;
        buffer: any;
    }>;
    private generateApplicationsAndCategoryWorksheet;
    private generateCertificatesWorksheet;
    private generateWorksheet;
}
