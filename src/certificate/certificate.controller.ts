import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
    OkResponse,
    PageResponse,
    Paginated,
    PaginationParams,
    QueryParam,
} from '../shared/decorators';
import { Roles } from '../shared/enums/roles.enum';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { CertificateService } from './certificate.service';
import { CertificateFilterOptionsDto } from './dto/certificate-filter-options.dto';
import { CertificateResponseDto } from './dto/certificate-response.dto';
import { UpdateCertificateStatusDto } from './dto/update-certificate-status.dto';
import { Certificate } from './entities/certificate.entity';

@Controller('certificates')
@ApiTags('Certificates')
export class CertificateController {
    constructor(private readonly certificateService: CertificateService) {}
    @Get()
    @Paginated()
    @PageResponse(Certificate)
    @Auth()
    async findAll(
        @GetUser() user: User,
        @PaginationParams() options: IPagination,
        @Query() filterOptions: CertificateFilterOptionsDto,
    ): Promise<GenericResponse<IPage<Certificate>>> {
        const results = await this.certificateService.findAll(
            user,
            options,
            filterOptions,
        );
        return { message: 'Certificates retrieved successfully', results };
    }

    @Get('/:uniqueId/company')
    @OkResponse(CertificateResponseDto)
    @Auth()
    async findOne(
        @Param('uniqueId') uniqueId: string,
    ): Promise<GenericResponse<Certificate>> {
        return {
            message: 'Certificate retrieved successfully',
            results: await this.certificateService.findCertificate(uniqueId),
        };
    }

    @Patch(':uniqueId/status')
    @Auth(Roles.DBI_ADMIN, Roles.DBI_EXPERT)
    @OkResponse(Certificate)
    async updateStatus(
        @Param('uniqueId') uniqueId: string,
        @Body() updateStatusDto: UpdateCertificateStatusDto,
    ): Promise<GenericResponse<Certificate>> {
        return {
            message: 'Certificate updated successfully',
            results: await this.certificateService.updateStatus(
                uniqueId,
                updateStatusDto.status,
            ),
        };
    }

    @Patch(':uniqueId/renew')
    @Auth()
    @OkResponse(Certificate)
    async renew(
        @Param('uniqueId') uniqueId: string,
    ): Promise<GenericResponse<Certificate>> {
        return {
            message: 'Certificate updated successfully',
            results: await this.certificateService.renewCertificate(uniqueId),
        };
    }

    @Patch(':uniqueId/renewing')
    @Auth()
    @OkResponse(Certificate)
    async renewing(
        @Param('uniqueId') uniqueId: string,
    ): Promise<GenericResponse<Certificate>> {
        return {
            message: 'Certificate in renewing process',
            results: await this.certificateService.isRenewingCertificate(
                uniqueId,
            ),
        };
    }

    @Get('/company-verification')
    @QueryParam('name', false)
    @OkResponse(Certificate)
    async applicantCertificateByName(
        @Query('name') name: string,
    ): Promise<GenericResponse<Certificate>> {
        return {
            message: 'Certificate retrieved successfully',
            results:
                await this.certificateService.findCertificateByApplicantName(
                    name,
                ),
        };
    }

    @Get('/company')
    @OkResponse(Certificate)
    @Auth()
    async applicantCertificateByLoggedIn(
        @GetUser() user: User,
    ): Promise<GenericResponse<Certificate>> {
        return {
            message: 'Certificate retrieved successfully',
            results:
                await this.certificateService.findCertificateByLoggedApplicant(
                    user,
                ),
        };
    }

    @Patch('/certificates-statuses')
    @OkResponse(Certificate)
    @Auth(Roles.DBI_ADMIN, Roles.DBI_EXPERT)
    async updateMultCerticatesStatus(
        @Body() UpdateStatusDto: UpdateCertificateStatusDto,
    ): Promise<GenericResponse<Certificate>> {
        await this.certificateService.updateMultipleStatuses(UpdateStatusDto);
        return {
            message: 'Certificates status updated successfully',
            results: null,
        };
    }
}
