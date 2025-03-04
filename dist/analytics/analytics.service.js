"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const date_fns_1 = require("date-fns");
const typeorm_2 = require("typeorm");
const XLSX = require("xlsx");
const application_entity_1 = require("../application/entities/application.entity");
const enums_1 = require("../application/enums");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const enums_2 = require("../certificate/enums");
const payment_entity_1 = require("../payment/entities/payment.entity");
const date_util_1 = require("../shared/utils/date.util");
const application_analytics_dto_1 = require("./dto/application-analytics.dto");
const certificate_analytics_dto_1 = require("./dto/certificate-analytics.dto");
let AnalyticsService = class AnalyticsService {
    constructor(certificateRepo, applicationRepo, paymentRepo) {
        this.certificateRepo = certificateRepo;
        this.applicationRepo = applicationRepo;
        this.paymentRepo = paymentRepo;
    }
    async getApplicationAnalytics(filterOptions) {
        let { actualStartDate, actualEndDate } = (0, date_util_1.getActualDateRange)(filterOptions.dateFrom, filterOptions.dateTo);
        actualStartDate = actualStartDate || (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(new Date(), 7));
        const allApplications = await this.applicationRepo.find({
            where: {
                createdAt: (0, typeorm_2.Between)(actualStartDate, actualEndDate),
            },
            relations: ['category'],
        });
        const applicationAnalytics = new application_analytics_dto_1.ApplicationAnalyticsDto();
        applicationAnalytics.total = allApplications.length;
        applicationAnalytics.totalApproved = allApplications.filter((a) => a.status === enums_1.EApplicationStatus.APPROVED).length;
        applicationAnalytics.totalPending = allApplications.filter((a) => a.status === enums_1.EApplicationStatus.PENDING).length;
        const allPayments = await this.paymentRepo.find({
            where: { createdAt: (0, typeorm_2.Between)(actualStartDate, actualEndDate) },
        });
        applicationAnalytics.expectedIncome = allApplications
            .filter((a) => [
            enums_1.EApplicationStatus.APPROVED,
            enums_1.EApplicationStatus.FIRST_STAGE_PASSED,
        ].includes(a.status))
            .reduce((sum, a) => sum + (a.subscriptionFee || 0), 0);
        applicationAnalytics.actualIncome = allPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalDenied = allApplications.filter((a) => a.status === enums_1.EApplicationStatus.DENIED).length;
        const totalFirstStagePassed = allApplications.filter((a) => a.status === enums_1.EApplicationStatus.FIRST_STAGE_PASSED).length;
        applicationAnalytics.statusPercentages = {
            pending: Math.round((applicationAnalytics.totalPending /
                applicationAnalytics.total) *
                100),
            approved: Math.round((applicationAnalytics.totalApproved /
                applicationAnalytics.total) *
                100),
            denied: Math.round((totalDenied / applicationAnalytics.total) * 100),
            firstStagePassed: Math.round((totalFirstStagePassed / applicationAnalytics.total) * 100),
        };
        const categoryNames = new Set(allApplications.map((a) => a.category.name));
        for (const name of categoryNames) {
            applicationAnalytics.categoryPercentages.push({
                name,
                percentage: Math.round((allApplications.filter((a) => a.category.name === name)
                    .length /
                    allApplications.length) *
                    100),
            });
        }
        const dates = (0, date_fns_1.eachDayOfInterval)({
            start: actualStartDate,
            end: actualEndDate,
        }).map((d) => `${(0, date_fns_1.format)(d, 'dd')}-${(0, date_fns_1.format)(d, 'MM')}-${(0, date_fns_1.format)(d, 'yyyy')}`);
        const grantedCertificates = await this.certificateRepo.find({
            where: { grantedAt: (0, typeorm_2.Between)(actualStartDate, actualEndDate) },
            relations: ['application'],
        });
        for (const date of dates) {
            const relevantApplications = allApplications.filter((a) => `${(0, date_fns_1.format)(a.createdAt, 'dd')}-${(0, date_fns_1.format)(a.createdAt, 'MM')}-${(0, date_fns_1.format)(a.createdAt, 'yyyy')}` === date);
            const relevantPayments = allPayments.filter((p) => `${(0, date_fns_1.format)(p.createdAt, 'dd')}-${(0, date_fns_1.format)(p.createdAt, 'MM')}-${(0, date_fns_1.format)(p.createdAt, 'yyyy')}` === date);
            const relevantCertificates = grantedCertificates.filter((c) => `${(0, date_fns_1.format)(c.grantedAt, 'dd')}-${(0, date_fns_1.format)(c.grantedAt, 'MM')}-${(0, date_fns_1.format)(c.grantedAt, 'yyyy')}` === date);
            applicationAnalytics.ratesByDate.push({
                date,
                all: relevantApplications.length,
                accepted: relevantApplications.filter((a) => a.status === enums_1.EApplicationStatus.APPROVED).length,
                denied: relevantApplications.filter((a) => a.status === enums_1.EApplicationStatus.DENIED).length,
            });
            applicationAnalytics.paymentsByDate.push({
                date,
                actual: relevantPayments.reduce((sum, p) => sum + p.amount, 0),
                expected: relevantCertificates.reduce((sum, c) => sum + c.application.subscriptionFee, 0),
            });
        }
        return applicationAnalytics;
    }
    async getCertificateAnalytics(filterOptions) {
        let { actualStartDate, actualEndDate } = (0, date_util_1.getActualDateRange)(filterOptions.dateFrom, filterOptions.dateTo);
        actualStartDate = actualStartDate || (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(new Date(), 7));
        const allCertificates = await this.certificateRepo.find({
            where: { createdAt: (0, typeorm_2.Between)(actualStartDate, actualEndDate) },
            relations: ['application', 'application.category'],
        });
        const certificateAnalytics = new certificate_analytics_dto_1.CertificateAnalyticsDto();
        certificateAnalytics.total = allCertificates.length;
        certificateAnalytics.totalGranted = allCertificates.filter((c) => c.status === enums_2.ECertificateStatus.GRANTED).length;
        certificateAnalytics.totalPending = allCertificates.filter((c) => c.status === enums_2.ECertificateStatus.PENDING_PAYMENT).length;
        const allPayments = await this.paymentRepo.find({
            where: { createdAt: (0, typeorm_2.Between)(actualStartDate, actualEndDate) },
        });
        certificateAnalytics.expectedIncome = allCertificates
            .filter((a) => [enums_2.ECertificateStatus.PENDING_PAYMENT].includes(a.status))
            .reduce((sum, a) => sum + (a.application.subscriptionFee || 0), 0);
        certificateAnalytics.actualIncome = allPayments.reduce((sum, p) => sum + p.amount, 0);
        const expired = allCertificates.filter((c) => c.expirationDate < new Date()).length;
        const revoked = allCertificates.filter((c) => c.status === enums_2.ECertificateStatus.REVOKED).length;
        certificateAnalytics.certificateStatus = {
            granted: Math.round(this.calcutateCertificateInPercentages(certificateAnalytics.totalGranted, certificateAnalytics.total)),
            pendingPayment: Math.round(this.calcutateCertificateInPercentages(certificateAnalytics.totalPending, certificateAnalytics.total)),
            expired: Math.round(this.calcutateCertificateInPercentages(expired, certificateAnalytics.total)),
            revoked: Math.round(this.calcutateCertificateInPercentages(revoked, certificateAnalytics.total)),
        };
        const categoryNames = new Set(allCertificates.map((a) => a.application.category.name));
        for (const name of categoryNames) {
            certificateAnalytics.categoryPercentages.push({
                name,
                percentage: Math.round((allCertificates.filter((a) => a.application.category.name === name).length /
                    allCertificates.length) *
                    100),
            });
        }
        const dates = (0, date_fns_1.eachDayOfInterval)({
            start: actualStartDate,
            end: actualEndDate,
        }).map((d) => `${(0, date_fns_1.format)(d, 'dd')}-${(0, date_fns_1.format)(d, 'MM')}-${(0, date_fns_1.format)(d, 'yyyy')}`);
        const grantedCertificates = await this.certificateRepo.find({
            where: { grantedAt: (0, typeorm_2.Between)(actualStartDate, actualEndDate) },
            relations: ['application'],
        });
        for (const date of dates) {
            const relevantApplications = allCertificates.filter((a) => `${(0, date_fns_1.format)(a.application.createdAt, 'dd')}-${(0, date_fns_1.format)(a.application.createdAt, 'MM')}-${(0, date_fns_1.format)(a.application.createdAt, 'yyyy')}` === date);
            const relevantPayments = allPayments.filter((p) => `${(0, date_fns_1.format)(p.createdAt, 'dd')}-${(0, date_fns_1.format)(p.createdAt, 'MM')}-${(0, date_fns_1.format)(p.createdAt, 'yyyy')}` === date);
            const relevantCertificates = grantedCertificates.filter((c) => `${(0, date_fns_1.format)(c.grantedAt, 'dd')}-${(0, date_fns_1.format)(c.grantedAt, 'MM')}-${(0, date_fns_1.format)(c.grantedAt, 'yyyy')}` === date);
            certificateAnalytics.ratesByDate.push({
                date,
                all: relevantCertificates.length,
                granted: relevantCertificates.filter((a) => a.status === enums_2.ECertificateStatus.GRANTED).length,
                revoked: relevantApplications.filter((a) => a.status === enums_2.ECertificateStatus.REVOKED).length,
            });
            certificateAnalytics.paymentsByDate.push({
                date,
                actual: relevantPayments.reduce((sum, p) => sum + p.amount, 0),
                expected: relevantCertificates.reduce((sum, c) => sum + c.application.subscriptionFee, 0),
            });
        }
        return certificateAnalytics;
    }
    calcutateCertificateInPercentages(totalPerStatus, total) {
        return (totalPerStatus * 100) / total;
    }
    async downloadAnalytics(filterOptions) {
        let { actualStartDate, actualEndDate } = (0, date_util_1.getActualDateRange)(filterOptions.dateFrom, filterOptions.dateTo);
        actualStartDate = actualStartDate || (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(new Date(), 7));
        const workbook = XLSX.utils.book_new();
        const [applicationsWorksheet, categoryWorkSheet] = await this.generateApplicationsAndCategoryWorksheet(actualStartDate, actualEndDate);
        const certificatesWorksheet = await this.generateCertificatesWorksheet(actualStartDate, actualEndDate);
        XLSX.utils.book_append_sheet(workbook, applicationsWorksheet, 'Applications');
        XLSX.utils.book_append_sheet(workbook, certificatesWorksheet, 'Certificates');
        XLSX.utils.book_append_sheet(workbook, categoryWorkSheet, 'Categories');
        const fileName = `Analytics-${new Date().toISOString().split('T')[0]}.xlsx`;
        const buffer = XLSX.write(workbook, { type: 'buffer' });
        return {
            fileName: fileName,
            buffer,
        };
    }
    async generateApplicationsAndCategoryWorksheet(actualStartDate, actualEndDate) {
        const allApplications = await this.applicationRepo.find({
            where: { createdAt: (0, typeorm_2.Between)(actualStartDate, actualEndDate) },
            relations: ['category', 'applicant'],
        });
        const applicationRows = allApplications.map((a) => {
            var _a, _b, _c;
            return (Object.assign(Object.assign({}, new application_analytics_dto_1.ApplicationRowDto()), { companyName: a.applicant.name, email: a.applicant.email, phone: a.applicant.phone, category: a.category.name, status: (_a = a.status) === null || _a === void 0 ? void 0 : _a.replace(/_/g, ' '), appliedDate: (_c = (_b = a.submittedAt) === null || _b === void 0 ? void 0 : _b.toISOString()) === null || _c === void 0 ? void 0 : _c.split('T')[0] }));
        });
        const applicationsWorksheet = this.generateWorksheet(applicationRows, [
            'Company name',
            'Email',
            'Phone No',
            'Category',
            'Status',
            'Applied Date',
        ]);
        const max_width = applicationRows.reduce((w, row) => Math.max(w, row.companyName.length, row.category.length, row.email.length, row.phone.length, row.status.length), 10);
        applicationsWorksheet['!cols'] = [{ wch: max_width }];
        const categoryNames = new Set(allApplications.map((a) => a.category.name));
        const categoryRows = [];
        for (const name of categoryNames) {
            categoryRows.push({
                name,
                percentage: Math.round((allApplications.filter((a) => a.category.name === name)
                    .length /
                    allApplications.length) *
                    100),
            });
        }
        const categoryWorkSheet = this.generateWorksheet(categoryRows, [
            'Name',
            'Percentage',
        ]);
        return [applicationsWorksheet, categoryWorkSheet];
    }
    async generateCertificatesWorksheet(actualStartDate, actualEndDate) {
        const allCertificates = await this.certificateRepo.find({
            where: { createdAt: (0, typeorm_2.Between)(actualStartDate, actualEndDate) },
            relations: [
                'application',
                'application.applicant',
                'application.category',
            ],
        });
        const certificateRows = allCertificates.map((c) => {
            var _a, _b, _c;
            return (Object.assign(Object.assign({}, new certificate_analytics_dto_1.CertificateRowDto()), { companyName: c.application.applicant.name, email: c.application.applicant.email, phone: c.application.applicant.phone, category: c.application.category.name, status: (_a = c.status) === null || _a === void 0 ? void 0 : _a.replace(/_/g, ' '), issueDate: (_c = (_b = c.createdAt) === null || _b === void 0 ? void 0 : _b.toISOString()) === null || _c === void 0 ? void 0 : _c.split('T')[0] }));
        });
        const certificatesWorksheet = this.generateWorksheet(certificateRows, [
            'Company name',
            'Email',
            'Phone No',
            'Category',
            'Status',
            'Issue Date',
        ]);
        const max_width = certificateRows.reduce((w, row) => Math.max(w, row.companyName.length, row.category.length, row.email.length, row.phone.length, row.status.length), 10);
        certificatesWorksheet['!cols'] = [{ wch: max_width }];
        return certificatesWorksheet;
    }
    generateWorksheet(rows, headers) {
        const worksheet = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(worksheet, [[...headers]], {
            origin: 'A1',
        });
        return worksheet;
    }
};
AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(1, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map