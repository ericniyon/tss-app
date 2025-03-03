import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Brackets, Repository } from 'typeorm';
import { Application } from '../application/entities/application.entity';
import { EApplicationStatus } from '../application/enums';
import { SendGridService } from '../notification/sendgrid.service';
import { Payment } from '../payment/entities/payment.entity';
import { EPaymentType } from '../payment/enums/payment-type.enum';
import { Roles } from '../shared/enums/roles.enum';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { CertificateStatusUpdateEmailTemplate } from '../shared/templates/certificate-status-update.email';
import { getActualDateRange } from '../shared/utils/date.util';
import { User } from '../users/entities/user.entity';
import { CertificateFilterOptionsDto } from './dto/certificate-filter-options.dto';
import { UpdateCertificateStatusDto } from './dto/update-certificate-status.dto';
import { Certificate } from './entities/certificate.entity';
import { ECertificateStatus } from './enums';
@Injectable()
export class CertificateService {
    constructor(
        @InjectRepository(Certificate)
        private readonly certificateRepo: Repository<Certificate>,
        private sendgridService: SendGridService,
        private configService: ConfigService,
        @InjectRepository(Application)
        private readonly appRepo: Repository<Application>,
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}
    async findAll(
        user: User,
        options: IPagination,
        { sort, ...filterOptions }: CertificateFilterOptionsDto,
    ): Promise<IPage<Certificate>> {
        const queryBuilder = this.certificateRepo
            .createQueryBuilder('certificate')
            .leftJoin('certificate.application', 'application')
            .leftJoin('application.applicant', 'applicant')
            .leftJoin('application.category', 'category')
            .leftJoin('application.assignees', 'assignees')
            .addSelect([
                'application',
                'category.id',
                'category.name',
                'applicant.id',
                'applicant.name',
                'applicant.email',
                'applicant.phone',
                'assignees.id',
                'assignees.name',
            ]);
        const { actualStartDate, actualEndDate } = getActualDateRange(
            filterOptions.dateFrom,
            filterOptions.dateTo,
        );
        if (actualStartDate) {
            queryBuilder.andWhere(
                'certificate.createdAt BETWEEN :actualStartDate AND :actualEndDate',
                {
                    actualStartDate,
                    actualEndDate,
                },
            );
        }
        if (user.role === Roles.DBI_EXPERT) {
            queryBuilder.andWhere(
                'application.id IN (select "applicationsId" from applications_assignees_users where "usersId" = :userId)',
                {
                    userId: user.id,
                },
            );
        } else if (user.role === Roles.COMPANY) {
            queryBuilder.andWhere('applicant.id = :applicantId', {
                applicantId: user.id,
            });
        }

        if (filterOptions.categories)
            queryBuilder.andWhere(`category.id IN (:...categories)`, {
                categories: [...filterOptions.categories],
            });

        if (
            Object.values(ECertificateStatus).includes(filterOptions.status) &&
            filterOptions.status !== 'EXPIRED'
        ) {
            queryBuilder.andWhere('certificate.status = :status', {
                status: filterOptions?.status,
            });
        }

        if (filterOptions.status === 'EXPIRED') {
            queryBuilder.andWhere('certificate.expirationDate < :currentDate', {
                currentDate: new Date(),
            });
        }

        if (!isNaN(filterOptions.assignee) && filterOptions.assignee) {
            queryBuilder.andWhere(':assigneeIds = assignees.id', {
                assigneeIds: filterOptions.assignee,
            });
        }
        if (filterOptions.search) {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where('applicant.name ILIKE :name', {
                        name: `%${filterOptions?.search}%`,
                    }).orWhere('certificate.status ILIKE :status', {
                        status: `%${filterOptions?.search}%`,
                    });
                }),
            );
        }
        if (sort) {
            queryBuilder.orderBy(
                sort.split('__')[0] === 'NAME'
                    ? 'applicant.name'
                    : 'certificate.createdAt',
                sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC',
            );
        } else {
            queryBuilder.orderBy('certificate.createdAt', 'DESC');
        }
        queryBuilder.getRawAndEntities();
        const { items, meta } = await paginate(queryBuilder, options);
        return { items, ...meta };
    }

    async renewCertificate(uniqueId: string): Promise<Certificate> {
        const certificate = await this.findOne(uniqueId);
        if (!certificate) throw new NotFoundException('Certificate not found');
        certificate.status = ECertificateStatus.GRANTED;
        certificate.isRenewing = false;
        certificate.expirationDate =
            certificate.isExpired() || !certificate.expirationDate
                ? new Date('30 JUN  2025')
                : new Date('30 JUN  2025');
            // certificate.isExpired() || !certificate.expirationDate
                // ? this.setExpiration(1)
                // : this.setExpiration(1, certificate.expirationDate);
        const result = await this.certificateRepo.save(certificate);
        const admins = await this.userRepo.find({
            where: { activated: true, role: Roles.DBI_ADMIN },
        });
        const updateEmail = {
            to: certificate.application.applicant.email,
            cc: certificate.application.assignees.map((a) => a.email),
            bcc: admins.map((a) => a.email),
            subject: 'Trust seal certificate renewed successfully.',
            from: this.configService.get('sendgrid').fromEmail,
            text: `Hello ${certificate.application.applicant.name}, your certificate status has been updated`,
            html: CertificateStatusUpdateEmailTemplate(
                certificate.application.applicant,
                result.status,
                'has been renewed.',
                this.configService.get('web').clientUrl,
            ),
        };
        this.sendgridService.send(updateEmail);
        return result;
    }

    async isRenewingCertificate(uniqueId: string): Promise<Certificate> {
        const certificate = await this.findOne(uniqueId);
        const application: Application = certificate.application;
        if (!certificate) throw new NotFoundException('Certificate not found');
        certificate.isRenewing = true;
        application.answers = [];
        application.status = EApplicationStatus.PENDING;
        application.submittedAt = new Date();
        await this.appRepo.save(application);
        const result = await this.certificateRepo.save(certificate);
        return result;
    }

    async updateStatus(
        uniqueId: string,
        status: ECertificateStatus,
    ): Promise<Certificate> {
        const certificate = await this.findOne(uniqueId);
        if (!certificate) throw new NotFoundException('Certificate not found');
        certificate.status = status;
        await this.certificateRepo.save(certificate);
        if (
            [ECertificateStatus.GRANTED, ECertificateStatus.REVOKED].includes(
                certificate.status,
            )
        ) {
            let message: string;
            if (certificate.status === ECertificateStatus.REVOKED) {
                message = `has been revoked.<br/>
            Please get in contact with our Certification expert for more details and to revalidate it again.<br/>
            Otherwise you are obliged to remove the trust seal from your website as well as all other marketing material you might be using.
`;
            } else if (certificate.status === ECertificateStatus.GRANTED) {
                message = `has been fully activated and is now valid for 12 Months.<br/>

            You can download your trust seal by logging into your account.
            `;
                certificate.expirationDate = new Date("30 JUN 2025");
                
                // certificate.expirationDate = this.setExpiration(1);
                certificate.grantedAt = new Date();
                await this.certificateRepo.save(certificate);
                await this.paymentRepo.save({
                    ...new Payment(),
                    amount: certificate.application.subscriptionFee || 0,
                    type: EPaymentType.SUBSCRIPTION_FEE,
                    certificate,
                });
            }
            const admins = await this.userRepo.find({
                where: { activated: true, role: Roles.DBI_ADMIN },
            });
            const updateEmail = {
                to: certificate.application.applicant.email,
                cc: certificate.application.assignees.map((a) => a.email),
                bcc: admins.map((a) => a.email),
                subject: 'DBI Trust Seal Account Notification',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello ${certificate.application.applicant.name} Team, your certificate status has been updated`,
                html: CertificateStatusUpdateEmailTemplate(
                    certificate.application.applicant,
                    certificate.status,
                    message,
                    this.configService.get('web').clientUrl,
                ),
            };
            this.sendgridService.send(updateEmail);
        }
        return certificate;
    }

    async findCertificate(uniqueId: string): Promise<Certificate> {
        const certificate = await this.findOne(uniqueId);
        if (!certificate) throw new NotFoundException('Certificate not found');
        return certificate;
    }

    async findCertificateByApplicantName(name: string): Promise<Certificate> {
        const certificates = await this.certificateRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.application', 'application')
            .leftJoinAndSelect('application.applicant', 'applicant')
            .leftJoinAndSelect('application.category', 'category')
            .where('applicant.name ILIKE :name', {
                name: `%${name}%`,
            })
            .orderBy('application.createdAt', 'DESC')
            .getMany();

        if (certificates.length <= 0)
            throw new NotFoundException(
                'We have no certificate with provided applicant name',
            );

        return certificates[0];
    }

    async findCertificateByLoggedApplicant(user: User): Promise<Certificate> {
        const certificates = await this.certificateRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.application', 'application')
            .leftJoinAndSelect('application.applicant', 'applicant')
            .leftJoinAndSelect('application.category', 'category')
            .where('applicant.id = :id', {
                id: user.id,
            })
            .orderBy('application.createdAt', 'DESC')
            .getMany();

        if (certificates.length <= 0)
            throw new NotFoundException('We have no certificate');

        return certificates[0];
    }

    async updateMultipleStatuses(
        updateStatusDto: UpdateCertificateStatusDto,
    ): Promise<void> {
        const certificates = await this.certificateRepo
            .createQueryBuilder('certificate')
            .where('certificate.id IN (:...ids)', {
                ids: [...updateStatusDto.certificates],
            })
            .getMany();
        if (certificates && certificates.length > 0) {
            for (const certificate of certificates) {
                await this.updateStatus(
                    certificate.uniqueId,
                    updateStatusDto.status,
                );
            }
        }
    }

    async findOne(uniqueId: string): Promise<Certificate> {
        const certificate = await this.certificateRepo.findOne({
            where: { uniqueId },
            relations: [
                'application',
                'application.applicant',
                'application.category',
                'application.assignees',
            ],
        });
        return certificate;
    }
    setExpiration(yr: number, date: Date = new Date()): any {
        const dt = new Date(date);
        dt.setFullYear(dt.getFullYear() + yr);
        return dt;
    }
}
