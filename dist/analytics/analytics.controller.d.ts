import { Response } from 'express';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { AnalyticsService } from './analytics.service';
import { AnalyticsFilterOptionsDto } from './dto/analytics-filter-options.dto';
import { ApplicationAnalyticsDto } from './dto/application-analytics.dto';
import { CertificateAnalyticsDto } from './dto/certificate-analytics.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getApplicationAnalytics(filterOptions: AnalyticsFilterOptionsDto): Promise<GenericResponse<ApplicationAnalyticsDto>>;
    getCertificateAnalytics(filterOptions: AnalyticsFilterOptionsDto): Promise<GenericResponse<CertificateAnalyticsDto>>;
    downloadAnalytics(filterOptions: AnalyticsFilterOptionsDto, res: Response): Promise<GenericResponse<any>>;
}
