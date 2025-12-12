import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
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
import {
    CreateOrUpdateAnswersDto,
    CreateStandaloneAnswerDto,
    CreateBulkStandaloneAnswersDto,
} from './dto/create-answer.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewAnswersDto } from './dto/update-answer-status.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Answer } from './entities/answer.entity';
import { Application } from './entities/application.entity';
import { ApplicationSnapshot } from './entities/application-snapshot.entity';
import { EAnswerStatus, EApplicationStatus } from './enums';
import {
    IApplication,
    IEditableApplication,
} from './interfaces/application.interface';
import { ApplicationSnapshotPayload } from './utils/application-snapshot.util';

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
        @InjectRepository(ApplicationSnapshot)
        private readonly snapshotRepo: Repository<ApplicationSnapshot>,
        private sendgridService: SendGridService,
        private configService: ConfigService,
        private certificateService: CertificateService,
        private httpService: HttpService,

        private readonly connection: Connection,
    ) {}
    async create(
        createApplicationDto: CreateApplicationDto,
        user: User,
    ): Promise<{ application: Application | IEditableApplication; isResumed: boolean }> {
        const category = await this.categoryRepo.findOne(
            createApplicationDto.categoryId,
        );
        if (!category) throw new NotFoundException('Category not found');
        
        // Check if user has an in-progress application for THIS specific category
        // Include SUBMITTED status as it can be resumed if not yet reviewed
        const existingApplication = await this.applicationRepo.findOne({
            where: {
                applicant: user,
                category: { id: category.id },
                status: Any([
                    EApplicationStatus.PENDING,
                    EApplicationStatus.FIRST_STAGE_PASSED,
                    EApplicationStatus.SUBMITTED,
                ]),
            },
            relations: ['category', 'applicant'],
            order: { createdAt: 'DESC' }, // Get the most recent one
        });

        // If existing application found, return editable form data (resume functionality)
        if (existingApplication) {
            // Optionally update companyUrl if provided and different
            if (
                createApplicationDto.companyUrl &&
                existingApplication.companyUrl !== createApplicationDto.companyUrl
            ) {
                existingApplication.companyUrl = createApplicationDto.companyUrl;
                await this.applicationRepo.save(existingApplication);
            }

            // Update answers if provided
            if (createApplicationDto.answers) {
                await this.createOrUpdateAnswers(
                    existingApplication.id,
                    createApplicationDto.answers,
                );
            }

            // Return editable application data with all questions and existing answers
            // This allows the form to be pre-filled
            return {
                application: await this.findEditableApplication(
                    existingApplication.id,
                    user,
                ),
                isResumed: true,
            };
        }

        // Create new application if none exists
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

        return {
            application: await this.findOne({
                where: { id: newApplication.id },
            }),
            isResumed: false,
        };
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
        
        // Auto-submit when answers are updated during certificate renewal
        const isRenewing =
            application.certificate && application.certificate.isRenewing;
        // Only auto-submit during certificate renewal
        if (isRenewing && application.status !== EApplicationStatus.APPROVED) {
            application.status = EApplicationStatus.SUBMITTED;
            application.submittedAt = new Date();
            await this.applicationRepo.save(application);
        }
        
        return await this.findOne({ where: { id: application.id } });
    }

    async createAnswer(
        dto: CreateStandaloneAnswerDto,
    ): Promise<Answer> {
        // Validate application exists
        const application = await this.findOne({
            where: { id: dto.applicationId },
        });
        if (!application) {
            throw new NotFoundException(
                `Application with id[${dto.applicationId}] not found.`,
            );
        }

        // Validate question exists
        const question = await this.questionRepo.findOne({
            where: { id: dto.questionId },
        });
        if (!question) {
            throw new NotFoundException(
                `Question with id[${dto.questionId}] not found.`,
            );
        }

        // Check if answer already exists for this application and question
        const existingAnswer = await this.answerRepo.findOne({
            where: {
                application: { id: dto.applicationId },
                question: { id: dto.questionId },
            },
        });

        if (existingAnswer) {
            throw new BadRequestException(
                'An answer already exists for this application and question combination.',
            );
        }

        // Create new answer
        const answer = new Answer();
        const newAnswer = await this.answerRepo.save({
            ...answer,
            application,
            question,
            questionText: dto.questionText,
            attachments: dto.attachments || [],
            responses: dto.responses,
            status: dto.status || null,
        });

        // Update question's hasBeenAsked flag
        question.hasBeenAsked = true;
        await this.questionRepo.save(question);

        return newAnswer;
    }

    async createBulkAnswers(
        dto: CreateBulkStandaloneAnswersDto,
    ): Promise<Answer[]> {
        const createdAnswers: Answer[] = [];

        for (const answerDto of dto.answers) {
            try {
                const answer = await this.createAnswer(answerDto);
                createdAnswers.push(answer);
            } catch (error) {
                // Log error but continue with other answers
                Logger.error(
                    `Failed to create answer for applicationId: ${answerDto.applicationId}, questionId: ${answerDto.questionId}`,
                    error.stack,
                    'ApplicationService',
                );
                // Re-throw if it's a critical error (not just duplicate)
                if (
                    !error.message?.includes('already exists') &&
                    !(error instanceof BadRequestException)
                ) {
                    throw error;
                }
            }
        }

        if (createdAnswers.length === 0) {
            throw new BadRequestException(
                'No answers were created. All answers may already exist or have validation errors.',
            );
        }

        return createdAnswers;
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

    async getInProgressApplicationForCategory(
        categoryId: number,
        user: User,
    ): Promise<IEditableApplication | null> {
        const category = await this.categoryRepo.findOne(categoryId);
        if (!category) throw new NotFoundException('Category not found');

        // Check for in-progress applications (PENDING, FIRST_STAGE_PASSED, or SUBMITTED)
        // SUBMITTED can be resumed if it hasn't been reviewed yet
        const existingApplication = await this.applicationRepo.findOne({
            where: {
                applicant: user,
                category: { id: categoryId },
                status: Any([
                    EApplicationStatus.PENDING,
                    EApplicationStatus.FIRST_STAGE_PASSED,
                    EApplicationStatus.SUBMITTED,
                ]),
            },
            relations: ['category', 'applicant'],
            order: { createdAt: 'DESC' }, // Get the most recent one
        });

        if (!existingApplication) {
            return null;
        }

        // Return editable application data with all questions and existing answers
        try {
            return await this.findEditableApplication(
                existingApplication.id,
                user,
            );
        } catch (error) {
            Logger.error(
                `Error finding editable application: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    async findLatestRenewCertificate(user: User): Promise<Application> {
        const application = await this.applicationRepo
            .createQueryBuilder('application')
            .leftJoin('application.applicant', 'applicant')
            .leftJoin('application.certificate', 'certificate')
            .where('applicant.id = :userId', { userId: user.id })
            .andWhere('certificate.isRenewing = :isRenewing', {
                isRenewing: true,
            })
            .orderBy('application.createdAt', 'DESC')
            .getOne();

        if (!application)
            throw new NotFoundException('Application not found for renewal');

        return await this.findOne({
            where: { id: application.id },
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

    async findLatestSnapshot(
        id: number,
        user: User,
    ): Promise<ApplicationSnapshotPayload> {
        const application = await this.applicationRepo.findOne({
            where: { id },
            relations: ['applicant'],
        });
        if (!application) throw new NotFoundException('Application not found');

        if (
            user.role === Roles.COMPANY &&
            application.applicant.id !== user.id
        ) {
            throw new BadRequestException(
                "You cannot view someone else's application snapshot",
            );
        }

        const snapshot = await this.snapshotRepo.findOne({
            where: { application: { id } },
            order: { createdAt: 'DESC' },
        });
        if (!snapshot)
            throw new NotFoundException('Application snapshot not found');

        return snapshot.payload as ApplicationSnapshotPayload;
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
        // First, get the application with basic relations
        const application = await this.applicationRepo.findOne({
            ...options,
            relations: [
                'category',
                'applicant',
                'assignees',
                'certificate',
            ],
        });
        if (!application) throw new NotFoundException('Application not found');

        // Fetch all answers separately to ensure we get all of them
        // This is more reliable than nested relations in findOne
        const answers = await this.answerRepo.find({
            where: { application: { id: application.id } },
            relations: ['question', 'question.section'],
            order: { id: 'ASC' },
        });

        // Attach answers to application
        application.answers = answers;

        let sections: {
            id: number;
            title: string;
            tips: string;
            answers: Answer[];
        }[] = [];
        for (const answer of application.answers) {
            if (answer.question?.section) {
                const sectionId = answer.question.section.id;
                const sectionIndex = sections.findIndex(
                    (s) => s.id === sectionId,
                );
                if (sectionIndex < 0) {
                    sections.push({
                        id: sectionId,
                        title: answer.question.section.title,
                        tips: answer.question.section.tips,
                        answers: [answer],
                    });
                } else {
                    sections[sectionIndex].answers.push(answer);
                }
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

    async findEditableApplication(
        id: number,
        user: User,
    ): Promise<IEditableApplication> {
        const application = await this.applicationRepo.findOne({
            where: { id },
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

        if (
            user.role === Roles.COMPANY &&
            application.applicant.id !== user.id
        ) {
            throw new BadRequestException(
                "You cannot view someone else's application",
            );
        }

        // Fetch all questions for this category (not just ones with answers)
        const allQuestions = await this.findQuestions(application.category.id);

        // If no questions found, return application with empty sections
        if (!allQuestions || allQuestions.length === 0) {
            return {
                ...application,
                answers: [],
                sections: [],
            };
        }

        // Fetch existing answers for this specific application
        const answers = await this.answerRepo.find({
            where: { application: { id } },
            relations: ['question', 'question.section'],
        });

        // Build map of question ID to answer for quick lookup
        const answersMap = new Map<number, Answer>();
        for (const answer of answers) {
            if (answer.question?.id) {
                answersMap.set(answer.question.id, answer);
            }
        }

        // Build sections map - include ALL questions, with answers where they exist
        const sectionsMap = new Map<
            number,
            IEditableApplication['sections'][number]
        >();

        for (const question of allQuestions) {
            if (!question.section) continue;

            if (!sectionsMap.has(question.section.id)) {
                sectionsMap.set(question.section.id, {
                    id: question.section.id,
                    title: question.section.title,
                    tips: question.section.tips,
                    questions: [],
                });
            }

            const currentSection = sectionsMap.get(question.section.id);
            if (!currentSection) continue;

            // Get existing answer if it exists
            const existingAnswer = answersMap.get(question.id);

            // Add question with answer if it exists, or without answer if it doesn't
            currentSection.questions.push({
                id: question.id,
                text: question.text,
                type: question.type,
                requiresAttachments: question.requiresAttachments,
                possibleAnswers: question.possibleAnswers || [],
                answer: existingAnswer
                    ? {
                          id: existingAnswer.id,
                          responses: existingAnswer.responses || [],
                          attachments: existingAnswer.attachments || [],
                          status: existingAnswer.status,
                          feedback: existingAnswer.feedback,
                      }
                    : undefined,
            });
        }

        // Sort sections and questions
        const sections = Array.from(sectionsMap.values())
            .map((section) => ({
                ...section,
                questions: section.questions.sort((a, b) => a.id - b.id),
            }))
            .sort((a, b) => a.id - b.id);

        // Return application with all questions and existing answers
        return {
            ...application,
            answers: answers,
            sections,
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
            // Allow updates during certificate renewal or if status is DENIED (for resubmission)
            // Block updates only if status is APPROVED (final state)
            const isRenewing =
                application.certificate && application.certificate.isRenewing;
            if (
                !isRenewing &&
                application.status === EApplicationStatus.APPROVED
            )
                throw new BadRequestException(
                    'Cannot update an approved application',
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
        
        // Auto-submit when application is updated by COMPANY user during renewal
        if (user.role === Roles.COMPANY) {
            const isRenewing =
                application.certificate && application.certificate.isRenewing;
            // Only auto-submit during certificate renewal
            if (isRenewing && application.status !== EApplicationStatus.APPROVED) {
                application.status = EApplicationStatus.SUBMITTED;
                application.submittedAt = new Date();
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

    async deleteCloudinaryImage(publicId: string, user: User): Promise<void> {
        if (!publicId) {
            throw new BadRequestException('Public ID is required');
        }

        // Find the answer that contains this attachment
        // Use a query to find answers where attachments array contains the publicId
        const answers = await this.answerRepo
            .createQueryBuilder('answer')
            .leftJoinAndSelect('answer.application', 'application')
            .leftJoinAndSelect('application.applicant', 'applicant')
            .where('answer.attachments::text LIKE :search', {
                search: `%${publicId}%`,
            })
            .getMany();

        // Find answer containing this attachment (exact match)
        let foundAnswer: Answer | null = null;
        let attachmentUrl: string | null = null;

        for (const answer of answers) {
            if (answer.attachments && answer.attachments.length > 0) {
                for (const attachment of answer.attachments) {
                    // Check if the attachment URL or public_id matches
                    if (
                        attachment === publicId ||
                        attachment.includes(publicId) ||
                        publicId.includes(attachment)
                    ) {
                        foundAnswer = answer;
                        attachmentUrl = attachment;
                        break;
                    }
                }
                if (foundAnswer) break;
            }
        }

        // Verify ownership (for COMPANY role users)
        if (user.role === Roles.COMPANY) {
            if (!foundAnswer) {
                throw new NotFoundException(
                    'Image not found in any of your applications',
                );
            }
            if (foundAnswer.application.applicant.id !== user.id) {
                throw new BadRequestException(
                    "You cannot delete images from someone else's application",
                );
            }
        } else if (!foundAnswer) {
            // For admins/experts, allow deletion even if not found in database
            // (might be orphaned or from deleted application)
            Logger.warn(
                `Image ${publicId} not found in database, proceeding with deletion anyway (admin/expert user)`,
            );
        }

        const cloudinaryCloudName =
            this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
        const cloudinaryApiKey =
            this.configService.get<string>('CLOUDINARY_API_KEY');
        const cloudinaryApiSecret =
            this.configService.get<string>('CLOUDINARY_API_SECRET');

        if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
            Logger.warn(
                'Cloudinary credentials not configured. Skipping image deletion.',
            );
            return;
        }

        try {
            // Extract public_id from full URL if provided
            let extractedPublicId = publicId;
            if (publicId.includes('cloudinary.com')) {
                // Extract public_id from Cloudinary URL
                // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
                const urlParts = publicId.split('/upload/');
                if (urlParts.length > 1) {
                    const pathAfterUpload = urlParts[1];
                    // Remove version if present (v1234567890/)
                    const withoutVersion = pathAfterUpload.replace(
                        /^v\d+\//,
                        '',
                    );
                    // Remove file extension
                    extractedPublicId = withoutVersion.replace(/\.[^/.]+$/, '');
                }
            } else if (attachmentUrl && attachmentUrl.includes('cloudinary.com')) {
                // Use the full URL from the database to extract public_id
                const urlParts = attachmentUrl.split('/upload/');
                if (urlParts.length > 1) {
                    const pathAfterUpload = urlParts[1];
                    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
                    extractedPublicId = withoutVersion.replace(/\.[^/.]+$/, '');
                }
            }

            // Use Cloudinary Admin API to delete
            const timestamp = Math.round(new Date().getTime() / 1000);
            const signature = crypto
                .createHash('sha1')
                .update(
                    `public_id=${extractedPublicId}&timestamp=${timestamp}${cloudinaryApiSecret}`,
                )
                .digest('hex');

            const deleteUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/destroy`;

            await firstValueFrom(
                this.httpService.post(deleteUrl, null, {
                    params: {
                        public_id: extractedPublicId,
                        api_key: cloudinaryApiKey,
                        timestamp: timestamp,
                        signature: signature,
                    },
                }),
            );

            // Remove attachment from answer if found
            if (foundAnswer && attachmentUrl) {
                foundAnswer.attachments = foundAnswer.attachments.filter(
                    (att) => att !== attachmentUrl,
                );
                await this.answerRepo.save(foundAnswer);
                Logger.log(
                    `Removed attachment from answer ${foundAnswer.id}: ${attachmentUrl}`,
                );
            }

            Logger.log(`Successfully deleted Cloudinary image: ${extractedPublicId}`);
        } catch (error) {
            Logger.error(
                `Failed to delete Cloudinary image: ${publicId}`,
                error.stack,
            );
            throw new BadRequestException(
                `Failed to delete image: ${error.message || 'Unknown error'}`,
            );
        }
    }

    // Application Management Methods
    async getManagementOverview(user: User): Promise<{
        total: number;
        ongoing: number;
        submitted: number;
        approved: number;
        denied: number;
        draft: number;
    }> {
        const queryBuilder = this.applicationRepo
            .createQueryBuilder('application')
            .leftJoin('application.applicant', 'applicant')
            .where('applicant.id = :applicantId', { applicantId: user.id });

        const [total, ongoing, submitted, approved, denied, draft] =
            await Promise.all([
                queryBuilder.getCount(),
                queryBuilder
                    .clone()
                    .andWhere('application.status IN (:...statuses)', {
                        statuses: [
                            EApplicationStatus.PENDING,
                            EApplicationStatus.FIRST_STAGE_PASSED,
                            EApplicationStatus.SUBMITTED,
                        ],
                    })
                    .getCount(),
                queryBuilder
                    .clone()
                    .andWhere('application.status = :status', {
                        status: EApplicationStatus.SUBMITTED,
                    })
                    .getCount(),
                queryBuilder
                    .clone()
                    .andWhere('application.status = :status', {
                        status: EApplicationStatus.APPROVED,
                    })
                    .getCount(),
                queryBuilder
                    .clone()
                    .andWhere('application.status = :status', {
                        status: EApplicationStatus.DENIED,
                    })
                    .getCount(),
                queryBuilder
                    .clone()
                    .andWhere('application.status = :status', {
                        status: EApplicationStatus.PENDING,
                    })
                    .andWhere('application.submittedAt IS NULL')
                    .getCount(),
            ]);

        return {
            total,
            ongoing,
            submitted,
            approved,
            denied,
            draft,
        };
    }

    async getOngoingApplications(
        user: User,
        options: IPagination,
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
                'assignees.id',
                'assignees.name',
            ])
            .where('applicant.id = :applicantId', { applicantId: user.id })
            .andWhere('application.status IN (:...statuses)', {
                statuses: [
                    EApplicationStatus.PENDING,
                    EApplicationStatus.FIRST_STAGE_PASSED,
                    EApplicationStatus.SUBMITTED,
                ],
            })
            .orderBy('application.createdAt', 'DESC');

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

    async getCompletedApplications(
        user: User,
        options: IPagination,
    ): Promise<IPage<Application>> {
        const queryBuilder = this.applicationRepo
            .createQueryBuilder('application')
            .leftJoin('application.applicant', 'applicant')
            .leftJoin('application.category', 'category')
            .leftJoin('application.assignees', 'assignees')
            .leftJoin('application.certificate', 'certificate')
            .addSelect([
                'category.id',
                'category.name',
                'applicant.id',
                'applicant.name',
                'applicant.email',
                'assignees.id',
                'assignees.name',
                'certificate.id',
                'certificate.uniqueId',
                'certificate.status',
            ])
            .where('applicant.id = :applicantId', { applicantId: user.id })
            .andWhere('application.status IN (:...statuses)', {
                statuses: [
                    EApplicationStatus.APPROVED,
                    EApplicationStatus.DENIED,
                ],
            })
            .orderBy('application.createdAt', 'DESC');

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

    async getDraftApplications(
        user: User,
        options: IPagination,
    ): Promise<IPage<Application>> {
        const queryBuilder = this.applicationRepo
            .createQueryBuilder('application')
            .leftJoin('application.applicant', 'applicant')
            .leftJoin('application.category', 'category')
            .addSelect([
                'category.id',
                'category.name',
                'applicant.id',
                'applicant.name',
                'applicant.email',
            ])
            .where('applicant.id = :applicantId', { applicantId: user.id })
            .andWhere('application.status = :status', {
                status: EApplicationStatus.PENDING,
            })
            .andWhere('application.submittedAt IS NULL')
            .orderBy('application.createdAt', 'DESC');

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
}
