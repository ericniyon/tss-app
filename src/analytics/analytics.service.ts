import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';
import { Between, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Application } from '../application/entities/application.entity';
import { EApplicationStatus } from '../application/enums';
import { Certificate } from '../certificate/entities/certificate.entity';
import { ECertificateStatus } from '../certificate/enums';
import { Payment } from '../payment/entities/payment.entity';
import { getActualDateRange } from '../shared/utils/date.util';
import { AnalyticsFilterOptionsDto } from './dto/analytics-filter-options.dto';
import {
    ApplicationAnalyticsDto,
    ApplicationRowDto,
    CategoryRowDto,
} from './dto/application-analytics.dto';
import {
    CertificateAnalyticsDto,
    CertificateRowDto,
} from './dto/certificate-analytics.dto';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Certificate)
        private readonly certificateRepo: Repository<Certificate>,
        @InjectRepository(Application)
        private readonly applicationRepo: Repository<Application>,
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,
    ) {}
    async getApplicationAnalytics(
        filterOptions: AnalyticsFilterOptionsDto,
    ): Promise<ApplicationAnalyticsDto> {
        // eslint-disable-next-line prefer-const
        let { actualStartDate, actualEndDate } = getActualDateRange(
            filterOptions.dateFrom,
            filterOptions.dateTo,
        );
        actualStartDate = actualStartDate || startOfDay(subDays(new Date(), 7));
        const allApplications = await this.applicationRepo.find({
            where: {
                createdAt: Between(actualStartDate, actualEndDate),
            },
            relations: ['category'],
        });

        const applicationAnalytics = new ApplicationAnalyticsDto();
        applicationAnalytics.total = allApplications.length;
        applicationAnalytics.totalApproved = allApplications.filter(
            (a) => a.status === EApplicationStatus.APPROVED,
        ).length;
        applicationAnalytics.totalPending = allApplications.filter(
            (a) => a.status === EApplicationStatus.PENDING,
        ).length;
        const allPayments = await this.paymentRepo.find({
            where: { createdAt: Between(actualStartDate, actualEndDate) },
        });
        applicationAnalytics.expectedIncome = allApplications
            .filter((a) =>
                [
                    EApplicationStatus.APPROVED,
                    EApplicationStatus.FIRST_STAGE_PASSED,
                ].includes(a.status),
            )
            .reduce(
                (sum: number, a: Application): number =>
                    sum + (a.subscriptionFee || 0),
                0,
            );
        applicationAnalytics.actualIncome = allPayments.reduce(
            (sum: number, p: Payment): number => sum + p.amount,
            0,
        );
        const totalDenied = allApplications.filter(
            (a) => a.status === EApplicationStatus.DENIED,
        ).length;
        const totalFirstStagePassed = allApplications.filter(
            (a) => a.status === EApplicationStatus.FIRST_STAGE_PASSED,
        ).length;
        applicationAnalytics.statusPercentages = {
            pending: Math.round(
                (applicationAnalytics.totalPending /
                    applicationAnalytics.total) *
                    100,
            ),
            approved: Math.round(
                (applicationAnalytics.totalApproved /
                    applicationAnalytics.total) *
                    100,
            ),
            denied: Math.round(
                (totalDenied / applicationAnalytics.total) * 100,
            ),
            firstStagePassed: Math.round(
                (totalFirstStagePassed / applicationAnalytics.total) * 100,
            ),
        };
        const categoryNames = new Set(
            allApplications.map((a) => a.category.name),
        );
        for (const name of categoryNames) {
            applicationAnalytics.categoryPercentages.push({
                name,
                percentage: Math.round(
                    (allApplications.filter((a) => a.category.name === name)
                        .length /
                        allApplications.length) *
                        100,
                ),
            });
        }
        const dates = eachDayOfInterval({
            start: actualStartDate,
            end: actualEndDate,
        }).map(
            (d) => `${format(d, 'dd')}-${format(d, 'MM')}-${format(d, 'yyyy')}`,
        );

        const grantedCertificates = await this.certificateRepo.find({
            where: { grantedAt: Between(actualStartDate, actualEndDate) },
            relations: ['application'],
        });
        for (const date of dates) {
            const relevantApplications = allApplications.filter(
                (a) =>
                    `${format(a.createdAt, 'dd')}-${format(
                        a.createdAt,
                        'MM',
                    )}-${format(a.createdAt, 'yyyy')}` === date,
            );
            const relevantPayments = allPayments.filter(
                (p) =>
                    `${format(p.createdAt, 'dd')}-${format(
                        p.createdAt,
                        'MM',
                    )}-${format(p.createdAt, 'yyyy')}` === date,
            );
            const relevantCertificates = grantedCertificates.filter(
                (c) =>
                    `${format(c.grantedAt, 'dd')}-${format(
                        c.grantedAt,
                        'MM',
                    )}-${format(c.grantedAt, 'yyyy')}` === date,
            );
            applicationAnalytics.ratesByDate.push({
                date,
                all: relevantApplications.length,
                accepted: relevantApplications.filter(
                    (a) => a.status === EApplicationStatus.APPROVED,
                ).length,
                denied: relevantApplications.filter(
                    (a) => a.status === EApplicationStatus.DENIED,
                ).length,
            });
            applicationAnalytics.paymentsByDate.push({
                date,
                actual: relevantPayments.reduce(
                    (sum: number, p) => sum + p.amount,
                    0,
                ),
                expected: relevantCertificates.reduce(
                    (sum: number, c) => sum + c.application.subscriptionFee,
                    0,
                ),
            });
        }
        return applicationAnalytics;
    }

    async getCertificateAnalytics(
        filterOptions: AnalyticsFilterOptionsDto,
    ): Promise<CertificateAnalyticsDto> {
        // eslint-disable-next-line prefer-const
        let { actualStartDate, actualEndDate } = getActualDateRange(
            filterOptions.dateFrom,
            filterOptions.dateTo,
        );
        actualStartDate = actualStartDate || startOfDay(subDays(new Date(), 7));
        const allCertificates = await this.certificateRepo.find({
            where: { createdAt: Between(actualStartDate, actualEndDate) },
            relations: ['application', 'application.category'],
        });

        const certificateAnalytics = new CertificateAnalyticsDto();
        certificateAnalytics.total = allCertificates.length;
        certificateAnalytics.totalGranted = allCertificates.filter(
            (c) => c.status === ECertificateStatus.GRANTED,
        ).length;
        certificateAnalytics.totalPending = allCertificates.filter(
            (c) => c.status === ECertificateStatus.PENDING_PAYMENT,
        ).length;
        const allPayments = await this.paymentRepo.find({
            where: { createdAt: Between(actualStartDate, actualEndDate) },
        });
        certificateAnalytics.expectedIncome = allCertificates
            .filter((a) =>
                [ECertificateStatus.PENDING_PAYMENT].includes(a.status),
            )
            .reduce(
                (sum: number, a: Certificate) =>
                    sum + (a.application.subscriptionFee || 0),
                0,
            );
        certificateAnalytics.actualIncome = allPayments.reduce(
            (sum: number, p) => sum + p.amount,
            0,
        );
        const expired = allCertificates.filter(
            (c) => c.expirationDate < new Date(),
        ).length;
        const revoked = allCertificates.filter(
            (c) => c.status === ECertificateStatus.REVOKED,
        ).length;
        certificateAnalytics.certificateStatus = {
            granted: Math.round(
                this.calcutateCertificateInPercentages(
                    certificateAnalytics.totalGranted,
                    certificateAnalytics.total,
                ),
            ),
            pendingPayment: Math.round(
                this.calcutateCertificateInPercentages(
                    certificateAnalytics.totalPending,
                    certificateAnalytics.total,
                ),
            ),
            expired: Math.round(
                this.calcutateCertificateInPercentages(
                    expired,
                    certificateAnalytics.total,
                ),
            ),
            revoked: Math.round(
                this.calcutateCertificateInPercentages(
                    revoked,
                    certificateAnalytics.total,
                ),
            ),
        };
        const categoryNames = new Set(
            allCertificates.map((a) => a.application.category.name),
        );
        for (const name of categoryNames) {
            certificateAnalytics.categoryPercentages.push({
                name,
                percentage: Math.round(
                    (allCertificates.filter(
                        (a) => a.application.category.name === name,
                    ).length /
                        allCertificates.length) *
                        100,
                ),
            });
        }
        const dates = eachDayOfInterval({
            start: actualStartDate,
            end: actualEndDate,
        }).map(
            (d) => `${format(d, 'dd')}-${format(d, 'MM')}-${format(d, 'yyyy')}`,
        );
        const grantedCertificates = await this.certificateRepo.find({
            where: { grantedAt: Between(actualStartDate, actualEndDate) },
            relations: ['application'],
        });
        for (const date of dates) {
            const relevantApplications = allCertificates.filter(
                (a) =>
                    `${format(a.application.createdAt, 'dd')}-${format(
                        a.application.createdAt,
                        'MM',
                    )}-${format(a.application.createdAt, 'yyyy')}` === date,
            );
            const relevantPayments = allPayments.filter(
                (p) =>
                    `${format(p.createdAt, 'dd')}-${format(
                        p.createdAt,
                        'MM',
                    )}-${format(p.createdAt, 'yyyy')}` === date,
            );
            const relevantCertificates = grantedCertificates.filter(
                (c) =>
                    `${format(c.grantedAt, 'dd')}-${format(
                        c.grantedAt,
                        'MM',
                    )}-${format(c.grantedAt, 'yyyy')}` === date,
            );
            certificateAnalytics.ratesByDate.push({
                date,
                all: relevantCertificates.length,
                granted: relevantCertificates.filter(
                    (a) => a.status === ECertificateStatus.GRANTED,
                ).length,
                revoked: relevantApplications.filter(
                    (a) => a.status === ECertificateStatus.REVOKED,
                ).length,
            });
            certificateAnalytics.paymentsByDate.push({
                date,
                actual: relevantPayments.reduce(
                    (sum: number, p) => sum + p.amount,
                    0,
                ),
                expected: relevantCertificates.reduce(
                    (sum: number, c) => sum + c.application.subscriptionFee,
                    0,
                ),
            });
        }
        return certificateAnalytics;
    }

    calcutateCertificateInPercentages(
        totalPerStatus: number,
        total: number,
    ): number {
        return (totalPerStatus * 100) / total;
    }

    async downloadAnalytics(filterOptions: AnalyticsFilterOptionsDto): Promise<{
        fileName: string;
        buffer: any;
    }> {
        // eslint-disable-next-line prefer-const
        let { actualStartDate, actualEndDate } = getActualDateRange(
            filterOptions.dateFrom,
            filterOptions.dateTo,
        );
        actualStartDate = actualStartDate || startOfDay(subDays(new Date(), 7));
        const workbook = XLSX.utils.book_new();
        const [applicationsWorksheet, categoryWorkSheet] =
            await this.generateApplicationsAndCategoryWorksheet(
                actualStartDate,
                actualEndDate,
            );
        const certificatesWorksheet = await this.generateCertificatesWorksheet(
            actualStartDate,
            actualEndDate,
        );

        XLSX.utils.book_append_sheet(
            workbook,
            applicationsWorksheet,
            'Applications',
        );
        XLSX.utils.book_append_sheet(
            workbook,
            certificatesWorksheet,
            'Certificates',
        );
        XLSX.utils.book_append_sheet(workbook, categoryWorkSheet, 'Categories');

        const fileName = `Analytics-${
            new Date().toISOString().split('T')[0]
        }.xlsx`;
        const buffer = XLSX.write(workbook, { type: 'buffer' });
        return {
            fileName: fileName,
            buffer,
        };
    }

    private async generateApplicationsAndCategoryWorksheet(
        actualStartDate: Date,
        actualEndDate: Date,
    ): Promise<XLSX.WorkSheet[]> {
        const allApplications = await this.applicationRepo.find({
            where: { createdAt: Between(actualStartDate, actualEndDate) },
            relations: ['category', 'applicant'],
        });
        const applicationRows = allApplications.map(
            (a): ApplicationRowDto => ({
                ...new ApplicationRowDto(),
                companyName: a.applicant.name,
                email: a.applicant.email,
                phone: a.applicant.phone,
                category: a.category.name,
                status: a.status?.replace(/_/g, ' '),
                appliedDate: a.submittedAt?.toISOString()?.split('T')[0],
            }),
        );
        const applicationsWorksheet = this.generateWorksheet(applicationRows, [
            'Company name',
            'Email',
            'Phone No',
            'Category',
            'Status',
            'Applied Date',
        ]);
        const max_width = applicationRows.reduce(
            (w, row: ApplicationRowDto) =>
                Math.max(
                    w,
                    row.companyName.length,
                    row.category.length,
                    row.email.length,
                    row.phone.length,
                    row.status.length,
                ),
            10,
        );
        applicationsWorksheet['!cols'] = [{ wch: max_width }];

        const categoryNames = new Set(
            allApplications.map((a) => a.category.name),
        );
        const categoryRows: CategoryRowDto[] = [];
        for (const name of categoryNames) {
            categoryRows.push({
                name,
                percentage: Math.round(
                    (allApplications.filter((a) => a.category.name === name)
                        .length /
                        allApplications.length) *
                        100,
                ),
            });
        }
        const categoryWorkSheet = this.generateWorksheet(categoryRows, [
            'Name',
            'Percentage',
        ]);
        return [applicationsWorksheet, categoryWorkSheet];
    }

    private async generateCertificatesWorksheet(
        actualStartDate: Date,
        actualEndDate: Date,
    ): Promise<XLSX.WorkSheet> {
        const allCertificates = await this.certificateRepo.find({
            where: { createdAt: Between(actualStartDate, actualEndDate) },
            relations: [
                'application',
                'application.applicant',
                'application.category',
            ],
        });
        const certificateRows = allCertificates.map(
            (c): CertificateRowDto => ({
                ...new CertificateRowDto(),
                companyName: c.application.applicant.name,
                email: c.application.applicant.email,
                phone: c.application.applicant.phone,
                category: c.application.category.name,
                status: c.status?.replace(/_/g, ' '),
                issueDate: c.createdAt?.toISOString()?.split('T')[0],
            }),
        );
        const certificatesWorksheet = this.generateWorksheet(certificateRows, [
            'Company name',
            'Email',
            'Phone No',
            'Category',
            'Status',
            'Issue Date',
        ]);
        const max_width = certificateRows.reduce(
            (w, row: CertificateRowDto) =>
                Math.max(
                    w,
                    row.companyName.length,
                    row.category.length,
                    row.email.length,
                    row.phone.length,
                    row.status.length,
                ),
            10,
        );
        certificatesWorksheet['!cols'] = [{ wch: max_width }];
        return certificatesWorksheet;
    }

    private generateWorksheet(rows: any[], headers: string[]): XLSX.WorkSheet {
        const worksheet = XLSX.utils.json_to_sheet(rows);

        // Fix Headers
        XLSX.utils.sheet_add_aoa(worksheet, [[...headers]], {
            origin: 'A1',
        });
        return worksheet;
    }
}
