import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { MailDataRequired } from '@sendgrid/mail';
import {
    Any,
    Brackets,
    Connection,
    FindOneOptions,
    Not,
    Repository,
} from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { CertificateService } from '../certificate/certificate.service';
import { Certificate } from '../certificate/entities/certificate.entity';
import { ECertificateStatus } from '../certificate/enums';
import { SendGridService } from '../notification/sendgrid.service';
import { Question } from '../question/entities/question.entity';
import { Section } from '../section/entities/section.entity';
import { Roles } from '../shared/enums/roles.enum';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { AssignmentEmailTemplate } from '../shared/templates/application-assign-email';
import { ApplicationStatusUpdateEmailTemplate } from '../shared/templates/application-status-update-email';
import {
    AdminSubmissionNotificationEmailTemplate,
    SubmissionEmailTemplate,
} from '../shared/templates/submission-email';
import { IdGenerator } from '../shared/utils/company-id-generator';
import { getActualDateRange } from '../shared/utils/date.util';
import { User } from '../users/entities/user.entity';
import { AddAssigneesDto } from './dto/add-assignees.dto';
import { ApplicationFilterOptionsDto } from './dto/application-filter-options.dto';
import { CreateOrUpdateAnswersDto } from './dto/create-answer.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewAnswersDto } from './dto/update-answer-status.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Answer } from './entities/answer.entity';
import { Application } from './entities/application.entity';
import { EAnswerStatus, EApplicationStatus } from './enums';
import { IApplication } from './interfaces/application.interface';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationRepo: Repository<Application>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Section)
        private readonly sectionRepo: Repository<Section>,
        @InjectRepository(Question)
        private readonly questionRepo: Repository<Question>,
        @InjectRepository(Answer)
        private readonly answerRepo: Repository<Answer>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Certificate)
        private readonly certificateRepo: Repository<Certificate>,
        private sendgridService: SendGridService,
        private configService: ConfigService,
        private certificateService: CertificateService,

        private readonly connection: Connection,
    ) {}
    async create(
        createApplicationDto: CreateApplicationDto,
        user: User,
    ): Promise<Application> {
        if (
            await this.applicationRepo.count({
                where: {
                    applicant: user,
                    status: Any([
                        EApplicationStatus.PENDING,
                        EApplicationStatus.FIRST_STAGE_PASSED,
                    ]),
                },
            })
        )
            throw new BadRequestException(
                'You have another application in progress',
            );
        const category = await this.categoryRepo.findOne(
            createApplicationDto.categoryId,
        );
        if (!category) throw new NotFoundException('Category not found');
        const newApplication = await this.applicationRepo.save({
            ...new Application(),
            companyUrl: createApplicationDto.companyUrl,
            category,
            applicant: user,
        });
        if (createApplicationDto.answers) {
            await this.createOrUpdateAnswers(
                newApplication.id,
                createApplicationDto.answers,
            );
        }

        return newApplication;
    }

    async createOrUpdateAnswers(
        id: number,
        dto: CreateOrUpdateAnswersDto,
    ): Promise<Application> {
        const application = await this.findOne({ where: { id } });
        const qns = await this.findQuestions(
            application.category.id,
            dto.sectionId,
        );
        if (dto.sectionId) {
            const qnIds = dto.answers.map((a) => a.questionId);
            if (!qns.every((qn) => qnIds.includes(qn.id)))
                throw new BadRequestException(
                    'You need to answer all questions for this section',
                );
        }
        const allQns = await this.findQuestions(application.category.id);
        for (const ans of dto.answers) {
            const question = allQns.find((q) => q.id === ans.questionId);
            if (!question)
                throw new NotFoundException(
                    `Question with id[${ans.questionId}] not found.`,
                );
            let existingAnswer = application.answers.find(
                (a) => a.question.id === ans.questionId,
            );
            if (existingAnswer) {
                delete ans.questionId;
                existingAnswer = { ...existingAnswer, ...ans };
                await this.answerRepo.save(existingAnswer);
            } else {
                const answer = new Answer();
                await this.answerRepo.save({
                    ...answer,
                    application,
                    question,
                    questionText: question.text,
                    attachments: ans.attachments,
                    responses: ans.responses,
                });
                question.hasBeenAsked = true;
            }
            await this.questionRepo.save(question);
        }
        return await this.findOne({ where: { id: application.id } });
    }
    async findAll(
        user: User,
        options: IPagination,
        { sort, ...filterOptions }: ApplicationFilterOptionsDto,
    ): Promise<IPage<Application>> {
        const queryBuilder = this.applicationRepo
            .createQueryBuilder('application')
            .leftJoin('application.applicant', 'applicant')
            .leftJoin('application.category', 'category')
            .leftJoin('application.assignees', 'assignees')
            .addSelect([
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
                'application.submittedAt BETWEEN :actualStartDate AND :actualEndDate',
                {
                    actualStartDate,
                    actualEndDate,
                },
            );
        }
        if ([Roles.DBI_ADMIN, Roles.DBI_EXPERT].includes(user.role)) {
            queryBuilder.andWhere('application.status != :appStatus', {
                appStatus: EApplicationStatus.PENDING,
            });
        }
        if (user.role === Roles.DBI_EXPERT) {
            queryBuilder.andWhere(
                'application.id IN (select "applicationsId" from applications_assignees_users where "usersId" = :userId)',
                {
                    userId: user.id,
                },
            );
        }
        if (user.role === Roles.COMPANY) {
            queryBuilder.andWhere('applicant.id = :applicantId', {
                applicantId: user.id,
            });
        }
        if (sort) {
            queryBuilder.orderBy(
                sort.split('__')[0] === 'NAME'
                    ? 'applicant.name'
                    : 'application.createdAt',
                sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC',
            );
        } else {
            queryBuilder.orderBy('application.createdAt', 'DESC');
        }
        if (filterOptions.categories) {
            queryBuilder.andWhere(`category.id IN (:...categories)`, {
                categories: [...filterOptions.categories],
            });
        }

        if (Object.values(EApplicationStatus).includes(filterOptions.status)) {
            queryBuilder.andWhere('application.status = :status', {
                status: filterOptions?.status,
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
                    }).orWhere('application.status ILIKE :status', {
                        status: `%${filterOptions?.search}%`,
                    });
                }),
            );
        }
        const result = await queryBuilder
            .skip((options.page - 1) * options.limit)
            .take(options.limit)
            .getManyAndCount();
        return {
            items: result[0],
            totalItems: result[1],
            itemCount: result[0].length,
            itemsPerPage: options.limit,
            totalPages: Math.ceil(result[1] / options.limit),
            currentPage: options.page,
        };
    }

    async findLatestPending(user: User): Promise<Application> {
        return await this.findOne({
            where: {
                applicant: user,
                status: Not(EApplicationStatus.APPROVED),
            },
            order: { createdAt: 'DESC' },
        });
    }
    async findCurrentApplicationOrCertificate(
        user: User,
    ): Promise<{ ongoingApplication: number; currentCertificate: number }> {
        const application = await this.findOne({
            where: {
                applicant: user,
            },
            order: { createdAt: 'DESC' },
        });
        const certificate = await this.certificateRepo.findOne({
            where: { application },
        });
        return {
            ongoingApplication:
                application.status !== EApplicationStatus.APPROVED &&
                application.id,
            currentCertificate: certificate && certificate.id,
        };
    }

    async findDeniedAnswers(id: number): Promise<Application> {
        const application = await this.findOne({
            where: {
                id,
                status: Not(EApplicationStatus.PENDING),
            },
            order: { createdAt: 'DESC' },
        });
        application.answers = application.answers.filter((ans) =>
            [
                EAnswerStatus.REJECTED,
                EAnswerStatus.FURTHER_INFO_REQUIRED,
            ].includes(ans.status),
        );
        application.sections.forEach((section) => {
            section.answers = section.answers.filter((ans) =>
                [
                    EAnswerStatus.REJECTED,
                    EAnswerStatus.FURTHER_INFO_REQUIRED,
                ].includes(ans.status),
            );
        });
        return application;
    }

    async findQuestions(
        categoryId: number,
        sectionId?: number,
    ): Promise<Question[]> {
        const queryBuilder = this.questionRepo
            .createQueryBuilder('question')
            .leftJoin('question.categories', 'categories')
            .leftJoinAndSelect('question.section', 'section')
            .where('question.active = true')
            .andWhere('section.active = true')
            .andWhere('categories.id = :categoryId', {
                categoryId,
            })
            .orderBy('question.id', 'ASC');

        if (sectionId) {
            const section: Section = await this.sectionRepo.findOne(sectionId);
            if (!section) throw new NotFoundException('Section not found');
            queryBuilder.andWhere('section.id = :sectionId', { sectionId });
        }
        return await queryBuilder.getMany();
    }

    async findOne(options: FindOneOptions<Application>): Promise<IApplication> {
        const application = await this.applicationRepo.findOne({
            ...options,
            relations: [
                'category',
                'applicant',
                'assignees',
                'certificate',
                'answers',
                'answers.question',
                'answers.question.section',
            ],
        });
        if (!application) throw new NotFoundException('Application not found');
        let sections: {
            id: number;
            title: string;
            tips: string;
            answers: Answer[];
        }[] = [];
        for (const answer of application.answers) {
            if (answer.question.section) {
                const title = answer.question.section?.title;
                const sectionIndex = sections.findIndex(
                    (s) => s.title === title,
                );
                if (sectionIndex < 0) {
                    sections.push({
                        title,
                        tips: answer.question.section?.tips,
                        answers: [answer],
                        id: answer.question.section.id,
                    });
                } else sections[sectionIndex].answers.push(answer);
            }
        }
        sections = sections.map((el) => ({
            ...el,
            answers: el.answers.sort((a, b) => a.id - b.id),
        }));
        return {
            ...application,
            status: application.status.replace(
                /[_]/g,
                ' ',
            ) as EApplicationStatus,
            sections: sections.sort((a, b) => a.id - b.id),
        };
    }

    async update(
        id: number,
        updateApplicationDto: UpdateApplicationDto,
        user: User,
    ): Promise<Application> {
        const application: Application = await this.findOne({ where: { id } });
        if (user.role === Roles.COMPANY) {
            if (application.applicant.id !== user.id)
                throw new BadRequestException(
                    "You cannot edit someone else's application",
                );
            if (
                application.status !== EApplicationStatus.DENIED &&
                application.submittedAt
            )
                throw new BadRequestException(
                    'Application has already been submitted',
                );
            if (updateApplicationDto.companyUrl)
                application.companyUrl = updateApplicationDto.companyUrl;
            if (
                updateApplicationDto.categoryId &&
                application.category.id !== updateApplicationDto.categoryId
            ) {
                const category = await this.categoryRepo.findOne(
                    updateApplicationDto.categoryId,
                );
                if (!category)
                    throw new NotFoundException('Category not found');
                application.answers = [];
                application.category = category;
            }
        }
        await this.applicationRepo.save(application);
        if (updateApplicationDto.answers) {
            await this.createOrUpdateAnswers(id, updateApplicationDto.answers);
        }
        return application;
    }

    async updateStatus(
        id: number,
        status: Exclude<
            EApplicationStatus,
            EApplicationStatus.SUBMITTED | EApplicationStatus.PENDING
        >,
        setupFee: number,
        subscriptionFee: number,
    ): Promise<Application> {
        try {
            const application = await this.findOne({
                where: {
                    id,
                    status: Not(EApplicationStatus.PENDING),
                },
                relations: ['assignees'],
            });
            if (
                application.status === EApplicationStatus.APPROVED &&
                status === EApplicationStatus.APPROVED
            )
                throw new BadRequestException(
                    'This application has already been granted',
                );
            application.status = status;
            const updatedApplication = await this.applicationRepo.save(
                application,
            );
            let message: string;
            if (application.status === EApplicationStatus.FIRST_STAGE_PASSED) {
                updatedApplication.setupFee = setupFee;
                updatedApplication.subscriptionFee = subscriptionFee;
                await this.applicationRepo.save(updatedApplication);
                message = `A verification check by a certification specialist will be conducted as the following and last step of the certification process. <br/>
                A certification specialist will contact you for the scheduling of the verification check.<br/>
                For any clarifications or inquiry kindly contact us by;<br/>
                E-mail: info@dbi.rw
                Telephone: +250781375971
                <br><br>
                Thanking You.
                `;
            } else if (application.status === EApplicationStatus.DENIED) {
                message = `has been denied.<br/>
            Please log into your account for further information and contact us under the following phone or email.`;
            } else if (application.status === EApplicationStatus.APPROVED) {
                const thisCertificate = await this.certificateRepo.findOne({
                    where: { application },
                });
                if (!thisCertificate) {
                    await this.certificateRepo.save({
                        uniqueId: IdGenerator(application.applicant.name),
                        application,
                    });
                } else {
                    thisCertificate.expirationDate = null;
                    thisCertificate.status = ECertificateStatus.PENDING_PAYMENT;
                    await this.certificateRepo.save(thisCertificate);
                }
                message = `has been Granted.<br/>

            Our Accounting department will shortly issue the invoice for you. Please use the following payment methods for payment:<br/>
            <p>Bank Account Number: 0000000000000000000</p>
            <p>MTN Mobile Money: +250788000000</p>
            `;
            }

            const admins = await this.userRepo.find({
                where: { activated: true, role: Roles.DBI_ADMIN },
            });
            const updateEmail: MailDataRequired = {
                to: application.applicant.email,
                cc: application.assignees.map((a) => a.email),
                bcc: admins.map((a) => a.email),
                subject: 'DBI Trust Seal Account Notification',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello ${application.applicant.name} Team, your application status has been updated`,
                html: ApplicationStatusUpdateEmailTemplate(
                    application.applicant,
                    application.status,
                    application.category.name,
                    message,
                ),
            };
            this.sendgridService.send(updateEmail);
            return application;
        } catch (err) {
            Logger.error(err);
        }
    }

    async addAssignees(
        id: number,
        addAssigneesDto: AddAssigneesDto,
    ): Promise<Application> {
        let application = await this.findOne({ where: { id } });
        for (const assigneeId of addAssigneesDto.assigneeIds) {
            const assignee = await this.userRepo.findOne({
                where: { id: assigneeId, role: Roles.DBI_EXPERT },
            });
            if (assignee) {
                application.assignees.push(assignee);
                application = await this.applicationRepo.save(application);
                const assignmentEmail = {
                    to: assignee.email,
                    subject: 'New Client Notification.',
                    from: this.configService.get('sendgrid').fromEmail,
                    text: `Hello, an application has been assigned to you!`,
                    html: AssignmentEmailTemplate(
                        assignee.name,
                        this.configService.get('web').adminUrl,
                    ),
                };
                this.sendgridService.send(assignmentEmail);
            }
        }

        return application;
    }

    async removeAssignee(id: number, assigneeId: number): Promise<Application> {
        const application = await this.findOne({ where: { id } });
        if (!application.assignees.find((a) => a.id === assigneeId)) {
            throw new NotFoundException(
                'This assignee does not exist on this application',
            );
        }
        application.assignees = application.assignees.filter(
            (a) => a.id !== assigneeId,
        );
        return await this.applicationRepo.save(application);
    }
    // TODO: Delete this method
    async updateAnswerStatus(
        id: number,
        status: EAnswerStatus,
        feedback?: string,
    ): Promise<Application> {
        const answer = await this.answerRepo.findOne(id, {
            relations: ['application'],
        });
        if (!answer) throw new NotFoundException('Answer not found');
        answer.status = status;
        if (feedback) answer.feedback = feedback;
        await this.answerRepo.save(answer);
        return await this.findOne({ where: { id: answer.application.id } });
    }

    async reviewAnswers(id: number, dto: ReviewAnswersDto): Promise<void> {
        if (!(await this.applicationRepo.findOne({ where: { id } })))
            throw new NotFoundException('Application not found');
        for (const el of dto.answers) {
            const answer = await this.answerRepo.findOne({
                where: { id: el.id, application: { id } },
            });
            if (answer) {
                answer.status = el.status;
                if (el.feedback) answer.feedback = el.feedback;
                await this.answerRepo.save(answer);
            }
        }
    }

    async submit(id: number, user: User): Promise<void> {
        try {
            const application = await this.findOne({ where: { id } });
            if (user.id !== application.applicant.id)
                throw new BadRequestException(
                    "You cannot submit someone else's application",
                );
            if (
                application.status !== EApplicationStatus.DENIED &&
                application.submittedAt
            )
                throw new BadRequestException(
                    'This application has already been submitted',
                );
            // const applicationQns = await this.findQuestions(
            //     application.category.id,
            // );
            // const answeredQnIds = application.answers.map((a) => a.question.id);
            // if (!applicationQns.every((qn) => answeredQnIds.includes(qn.id)))
            //     throw new BadRequestException(
            //         'You must answer all questions before submitting',
            //     );
            application.submittedAt = new Date();
            application.status = EApplicationStatus.SUBMITTED;
            if (application.certificate && application.certificate.isRenewing)
                this.certificateService.renewCertificate(
                    application.certificate.uniqueId,
                );
            await this.applicationRepo.save(application);
            const submissionEmail = {
                to: user.email,
                subject: 'Trust seal application submission.',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello ${user.name}, your application has been submitted`,
                html: SubmissionEmailTemplate(),
            };
            this.sendgridService
                .send(submissionEmail)
                .catch((e) => Logger.error(e));
            const admins = await this.userRepo.find({
                where: { role: Roles.DBI_ADMIN },
            });
            for (const admin of admins) {
                const adminSubmissionNotificationEmail = {
                    to: admin.email,
                    subject: 'Trust seal application submission.',
                    from: this.configService.get('sendgrid').fromEmail,
                    text: `Hello ${user.name}, an application has been submitted`,
                    html: AdminSubmissionNotificationEmailTemplate(
                        admin.name,
                        application.applicant.name,
                        this.configService.get('web').adminUrl,
                    ),
                };
                this.sendgridService
                    .send(adminSubmissionNotificationEmail)
                    .catch((e) => Logger.error(e));
            }
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async joinInterview(applicationId: number, user: User): Promise<void> {
        try {
            const application = await this.findOne({
                where: { id: applicationId },
            });

            if (user.id !== application.applicant.id) {
                throw new BadRequestException(
                    "You cannot join an interview for someone else's application",
                );
            }

            if (
                application.status !== EApplicationStatus.FIRST_STAGE_PASSED &&
                application.status !== EApplicationStatus.SUBMITTED
            ) {
                throw new BadRequestException(
                    'Interview is only available for applications that have passed the first stage or have been submitted',
                );
            }

            Logger.log(
                `User ${user.id} joined interview for application ${applicationId}`,
            );
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async remove(id: number): Promise<void> {
        await this.findOne({ where: { id } });
        await this.applicationRepo.softDelete(id);
    }

    async exportAllAnswersToExcel(
        categoryId?: number,
        year?: number,
    ): Promise<{
        fileName: string;
        buffer: any;
    }> {
        // Get all answers with the necessary relationships
        Logger.log('Exporting all answers to Excel started');

        const query = this.answerRepo
            .createQueryBuilder('answer')
            .leftJoinAndSelect('answer.application', 'application')
            .leftJoinAndSelect('application.applicant', 'applicant')
            .leftJoinAndSelect('application.category', 'category')
            .leftJoinAndSelect('answer.question', 'question')
            .leftJoinAndSelect('question.section', 'section');
        if (categoryId) {
            query.andWhere('category.id = :categoryId', { categoryId });
        }
        if (year) {
            // between from and to dates
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31`);
            query.andWhere('answer.createdAt BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const answers = await query
            .orderBy('category.name')
            .addOrderBy('section.title')
            .addOrderBy('applicant.phone')
            .addOrderBy('question.text')
            .getRawMany();

        Logger.log(`Found ${answers.length} answers`);
        Logger.log('Creating Excel workbook');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        // Get all unique questions
        const questions = new Set(
            answers.map((answer) => answer.question_text),
        );
        const columns = Array.from(questions).map((question) => ({
            header: question,
            key: question,
            width: 20,
        }));

        worksheet.columns = [
            {
                header: 'Submitted At',
                key: 'submittedAt',
                width: 20,
            },
            {
                header: 'Category',
                key: 'category',
                width: 20,
            },
            {
                header: 'Section',
                key: 'section',
                width: 20,
            },
            {
                header: 'Company Phone',
                key: 'companyPhone',
                width: 20,
            },
            {
                header: 'Company Name',
                key: 'companyName',
                width: 20,
            },
            {
                header: 'Company Email',
                key: 'companyEmail',
                width: 20,
            },
            ...columns,
        ];

        Logger.log('Adding rows to Excel workbook');

        // Add rows
        // Group by company phone and add all answers for each company as a row
        const groupedAnswers = answers.reduce((acc, answer) => {
            if (!acc[answer.applicant_phone]) {
                acc[answer.applicant_phone] = [];
            }
            acc[answer.applicant_phone].push(answer);
            return acc;
        }, {});

        Object.keys(groupedAnswers).forEach((companyPhone) => {
            const companyAnswers = groupedAnswers[companyPhone];
            const row = { companyPhone };
            companyAnswers.forEach((answer) => {
                row[answer.question_text] = answer.answer_responses;
                row['category'] = answer.category_name;
                row['section'] = answer.section_title;
                row['companyPhone'] = answer.applicant_phone;
                row['companyName'] = answer.applicant_name;
                row['companyEmail'] = answer.applicant_email;
                row['submittedAt'] = answer.answer_createdAt;
            });
            worksheet.addRow(row);
        });

        // Prepare and return buffer
        const buffer = await workbook.xlsx.writeBuffer();

        Logger.log('Exporting all answers completed');

        return {
            fileName: 'Answers.xlsx',
            buffer,
        };
    }
}
