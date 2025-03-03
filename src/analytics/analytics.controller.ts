import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { Auth } from '../auth/decorators/auth.decorator';
import { OkResponse } from '../shared/decorators';
import { Roles } from '../shared/enums/roles.enum';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { createReadableStream } from '../shared/utils/file.util';
import { AnalyticsService } from './analytics.service';
import { AnalyticsFilterOptionsDto } from './dto/analytics-filter-options.dto';
import { ApplicationAnalyticsDto } from './dto/application-analytics.dto';
import { CertificateAnalyticsDto } from './dto/certificate-analytics.dto';

@Controller('analytics')
@ApiTags('Analytics')
@Auth(Roles.DBI_ADMIN, Roles.DBI_EXPERT)
@ApiExtraModels(ApplicationAnalyticsDto)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}
    @Get('applications')
    @OkResponse(ApplicationAnalyticsDto)
    async getApplicationAnalytics(
        @Query() filterOptions: AnalyticsFilterOptionsDto,
    ): Promise<GenericResponse<ApplicationAnalyticsDto>> {
        const results = await this.analyticsService.getApplicationAnalytics(
            filterOptions,
        );
        return {
            message: 'Application analytics retrieved',
            results,
        };
    }

    @Get('certificates')
    async getCertificateAnalytics(
        @Query() filterOptions: AnalyticsFilterOptionsDto,
    ): Promise<GenericResponse<CertificateAnalyticsDto>> {
        const results = await this.analyticsService.getCertificateAnalytics(
            filterOptions,
        );
        return {
            message: 'Certificate analytics retrieved',
            results,
        };
    }

    @Get('download')
    async downloadAnalytics(
        @Query() filterOptions: AnalyticsFilterOptionsDto,
        @Res() res: Response,
    ): Promise<GenericResponse<any>> {
        const { fileName, buffer } =
            await this.analyticsService.downloadAnalytics(filterOptions);
        const stream = createReadableStream(buffer);
        res.set({
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length': buffer.length,
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });
        stream.pipe(res);
        return {
            message: 'Analytics downloaded',
        };
    }
}
