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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const ExcelJS = require("exceljs");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../category/entities/category.entity");
const certificate_service_1 = require("../certificate/certificate.service");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const enums_1 = require("../certificate/enums");
const sendgrid_service_1 = require("../notification/sendgrid.service");
const question_entity_1 = require("../question/entities/question.entity");
const section_entity_1 = require("../section/entities/section.entity");
const roles_enum_1 = require("../shared/enums/roles.enum");
const application_assign_email_1 = require("../shared/templates/application-assign-email");
const application_status_update_email_1 = require("../shared/templates/application-status-update-email");
const submission_email_1 = require("../shared/templates/submission-email");
const company_id_generator_1 = require("../shared/utils/company-id-generator");
const date_util_1 = require("../shared/utils/date.util");
const user_entity_1 = require("../users/entities/user.entity");
const answer_entity_1 = require("./entities/answer.entity");
const application_entity_1 = require("./entities/application.entity");
const enums_2 = require("./enums");
let ApplicationService = class ApplicationService {
    constructor(applicationRepo, categoryRepo, sectionRepo, questionRepo, answerRepo, userRepo, certificateRepo, sendgridService, configService, certificateService, connection) {
        this.applicationRepo = applicationRepo;
        this.categoryRepo = categoryRepo;
        this.sectionRepo = sectionRepo;
        this.questionRepo = questionRepo;
        this.answerRepo = answerRepo;
        this.userRepo = userRepo;
        this.certificateRepo = certificateRepo;
        this.sendgridService = sendgridService;
        this.configService = configService;
        this.certificateService = certificateService;
        this.connection = connection;
    }
    async create(createApplicationDto, user) {
        if (await this.applicationRepo.count({
            where: {
                applicant: user,
                status: (0, typeorm_2.Any)([
                    enums_2.EApplicationStatus.PENDING,
                    enums_2.EApplicationStatus.FIRST_STAGE_PASSED,
                ]),
            },
        }))
            throw new common_1.BadRequestException('You have another application in progress');
        const category = await this.categoryRepo.findOne(createApplicationDto.categoryId);
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        const newApplication = await this.applicationRepo.save(Object.assign(Object.assign({}, new application_entity_1.Application()), { companyUrl: createApplicationDto.companyUrl, category, applicant: user }));
        if (createApplicationDto.answers) {
            await this.createOrUpdateAnswers(newApplication.id, createApplicationDto.answers);
        }
        return newApplication;
    }
    async createOrUpdateAnswers(id, dto) {
        const application = await this.findOne({ where: { id } });
        const qns = await this.findQuestions(application.category.id, dto.sectionId);
        if (dto.sectionId) {
            const qnIds = dto.answers.map((a) => a.questionId);
            if (!qns.every((qn) => qnIds.includes(qn.id)))
                throw new common_1.BadRequestException('You need to answer all questions for this section');
        }
        const allQns = await this.findQuestions(application.category.id);
        for (const ans of dto.answers) {
            const question = allQns.find((q) => q.id === ans.questionId);
            if (!question)
                throw new common_1.NotFoundException(`Question with id[${ans.questionId}] not found.`);
            let existingAnswer = application.answers.find((a) => a.question.id === ans.questionId);
            if (existingAnswer) {
                delete ans.questionId;
                existingAnswer = Object.assign(Object.assign({}, existingAnswer), ans);
                await this.answerRepo.save(existingAnswer);
            }
            else {
                const answer = new answer_entity_1.Answer();
                await this.answerRepo.save(Object.assign(Object.assign({}, answer), { application,
                    question, questionText: question.text, attachments: ans.attachments, responses: ans.responses }));
                question.hasBeenAsked = true;
            }
            await this.questionRepo.save(question);
        }
        return await this.findOne({ where: { id: application.id } });
    }
    async findAll(user, options, _a) {
        var { sort } = _a, filterOptions = __rest(_a, ["sort"]);
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
        const { actualStartDate, actualEndDate } = (0, date_util_1.getActualDateRange)(filterOptions.dateFrom, filterOptions.dateTo);
        if (actualStartDate) {
            queryBuilder.andWhere('application.submittedAt BETWEEN :actualStartDate AND :actualEndDate', {
                actualStartDate,
                actualEndDate,
            });
        }
        if ([roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT].includes(user.role)) {
            queryBuilder.andWhere('application.status != :appStatus', {
                appStatus: enums_2.EApplicationStatus.PENDING,
            });
        }
        if (user.role === roles_enum_1.Roles.DBI_EXPERT) {
            queryBuilder.andWhere('application.id IN (select "applicationsId" from applications_assignees_users where "usersId" = :userId)', {
                userId: user.id,
            });
        }
        if (user.role === roles_enum_1.Roles.COMPANY) {
            queryBuilder.andWhere('applicant.id = :applicantId', {
                applicantId: user.id,
            });
        }
        if (sort) {
            queryBuilder.orderBy(sort.split('__')[0] === 'NAME'
                ? 'applicant.name'
                : 'application.createdAt', sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC');
        }
        else {
            queryBuilder.orderBy('application.createdAt', 'DESC');
        }
        if (filterOptions.categories) {
            queryBuilder.andWhere(`category.id IN (:...categories)`, {
                categories: [...filterOptions.categories],
            });
        }
        if (Object.values(enums_2.EApplicationStatus).includes(filterOptions.status)) {
            queryBuilder.andWhere('application.status = :status', {
                status: filterOptions === null || filterOptions === void 0 ? void 0 : filterOptions.status,
            });
        }
        if (!isNaN(filterOptions.assignee) && filterOptions.assignee) {
            queryBuilder.andWhere(':assigneeIds = assignees.id', {
                assigneeIds: filterOptions.assignee,
            });
        }
        if (filterOptions.search) {
            queryBuilder.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('applicant.name ILIKE :name', {
                    name: `%${filterOptions === null || filterOptions === void 0 ? void 0 : filterOptions.search}%`,
                }).orWhere('application.status ILIKE :status', {
                    status: `%${filterOptions === null || filterOptions === void 0 ? void 0 : filterOptions.search}%`,
                });
            }));
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
    async findLatestPending(user) {
        return await this.findOne({
            where: {
                applicant: user,
                status: (0, typeorm_2.Not)(enums_2.EApplicationStatus.APPROVED),
            },
            order: { createdAt: 'DESC' },
        });
    }
    async findCurrentApplicationOrCertificate(user) {
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
            ongoingApplication: application.status !== enums_2.EApplicationStatus.APPROVED &&
                application.id,
            currentCertificate: certificate && certificate.id,
        };
    }
    async findDeniedAnswers(id) {
        const application = await this.findOne({
            where: {
                id,
                status: (0, typeorm_2.Not)(enums_2.EApplicationStatus.PENDING),
            },
            order: { createdAt: 'DESC' },
        });
        application.answers = application.answers.filter((ans) => [
            enums_2.EAnswerStatus.REJECTED,
            enums_2.EAnswerStatus.FURTHER_INFO_REQUIRED,
        ].includes(ans.status));
        application.sections.forEach((section) => {
            section.answers = section.answers.filter((ans) => [
                enums_2.EAnswerStatus.REJECTED,
                enums_2.EAnswerStatus.FURTHER_INFO_REQUIRED,
            ].includes(ans.status));
        });
        return application;
    }
    async findQuestions(categoryId, sectionId) {
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
            const section = await this.sectionRepo.findOne(sectionId);
            if (!section)
                throw new common_1.NotFoundException('Section not found');
            queryBuilder.andWhere('section.id = :sectionId', { sectionId });
        }
        return await queryBuilder.getMany();
    }
    async findOne(options) {
        var _a, _b;
        const application = await this.applicationRepo.findOne(Object.assign(Object.assign({}, options), { relations: [
                'category',
                'applicant',
                'assignees',
                'certificate',
                'answers',
                'answers.question',
                'answers.question.section',
            ] }));
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        let sections = [];
        for (const answer of application.answers) {
            if (answer.question.section) {
                const title = (_a = answer.question.section) === null || _a === void 0 ? void 0 : _a.title;
                const sectionIndex = sections.findIndex((s) => s.title === title);
                if (sectionIndex < 0) {
                    sections.push({
                        title,
                        tips: (_b = answer.question.section) === null || _b === void 0 ? void 0 : _b.tips,
                        answers: [answer],
                        id: answer.question.section.id,
                    });
                }
                else
                    sections[sectionIndex].answers.push(answer);
            }
        }
        sections = sections.map((el) => (Object.assign(Object.assign({}, el), { answers: el.answers.sort((a, b) => a.id - b.id) })));
        return Object.assign(Object.assign({}, application), { status: application.status.replace(/[_]/g, ' '), sections: sections.sort((a, b) => a.id - b.id) });
    }
    async update(id, updateApplicationDto, user) {
        const application = await this.findOne({ where: { id } });
        if (user.role === roles_enum_1.Roles.COMPANY) {
            if (application.applicant.id !== user.id)
                throw new common_1.BadRequestException("You cannot edit someone else's application");
            if (application.status !== enums_2.EApplicationStatus.DENIED &&
                application.submittedAt)
                throw new common_1.BadRequestException('Application has already been submitted');
            if (updateApplicationDto.companyUrl)
                application.companyUrl = updateApplicationDto.companyUrl;
            if (updateApplicationDto.categoryId &&
                application.category.id !== updateApplicationDto.categoryId) {
                const category = await this.categoryRepo.findOne(updateApplicationDto.categoryId);
                if (!category)
                    throw new common_1.NotFoundException('Category not found');
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
    async updateStatus(id, status, setupFee, subscriptionFee) {
        try {
            const application = await this.findOne({
                where: {
                    id,
                    status: (0, typeorm_2.Not)(enums_2.EApplicationStatus.PENDING),
                },
                relations: ['assignees'],
            });
            if (application.status === enums_2.EApplicationStatus.APPROVED &&
                status === enums_2.EApplicationStatus.APPROVED)
                throw new common_1.BadRequestException('This application has already been granted');
            application.status = status;
            const updatedApplication = await this.applicationRepo.save(application);
            let message;
            if (application.status === enums_2.EApplicationStatus.FIRST_STAGE_PASSED) {
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
            }
            else if (application.status === enums_2.EApplicationStatus.DENIED) {
                message = `has been denied.<br/>
            Please log into your account for further information and contact us under the following phone or email.`;
            }
            else if (application.status === enums_2.EApplicationStatus.APPROVED) {
                const thisCertificate = await this.certificateRepo.findOne({
                    where: { application },
                });
                if (!thisCertificate) {
                    await this.certificateRepo.save({
                        uniqueId: (0, company_id_generator_1.IdGenerator)(application.applicant.name),
                        application,
                    });
                }
                else {
                    thisCertificate.expirationDate = null;
                    thisCertificate.status = enums_1.ECertificateStatus.PENDING_PAYMENT;
                    await this.certificateRepo.save(thisCertificate);
                }
                message = `has been Granted.<br/>

            Our Accounting department will shortly issue the invoice for you. Please use the following payment methods for payment:<br/>
            <p>Bank Account Number: 0000000000000000000</p>
            <p>MTN Mobile Money: +250788000000</p>
            `;
            }
            const admins = await this.userRepo.find({
                where: { activated: true, role: roles_enum_1.Roles.DBI_ADMIN },
            });
            const updateEmail = {
                to: application.applicant.email,
                cc: application.assignees.map((a) => a.email),
                bcc: admins.map((a) => a.email),
                subject: 'DBI Trust Seal Account Notification',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello ${application.applicant.name} Team, your application status has been updated`,
                html: (0, application_status_update_email_1.ApplicationStatusUpdateEmailTemplate)(application.applicant, application.status, application.category.name, message),
            };
            this.sendgridService.send(updateEmail);
            return application;
        }
        catch (err) {
            common_1.Logger.error(err);
        }
    }
    async addAssignees(id, addAssigneesDto) {
        let application = await this.findOne({ where: { id } });
        for (const assigneeId of addAssigneesDto.assigneeIds) {
            const assignee = await this.userRepo.findOne({
                where: { id: assigneeId, role: roles_enum_1.Roles.DBI_EXPERT },
            });
            if (assignee) {
                application.assignees.push(assignee);
                application = await this.applicationRepo.save(application);
                const assignmentEmail = {
                    to: assignee.email,
                    subject: 'New Client Notification.',
                    from: this.configService.get('sendgrid').fromEmail,
                    text: `Hello, an application has been assigned to you!`,
                    html: (0, application_assign_email_1.AssignmentEmailTemplate)(assignee.name, this.configService.get('web').adminUrl),
                };
                this.sendgridService.send(assignmentEmail);
            }
        }
        return application;
    }
    async removeAssignee(id, assigneeId) {
        const application = await this.findOne({ where: { id } });
        if (!application.assignees.find((a) => a.id === assigneeId)) {
            throw new common_1.NotFoundException('This assignee does not exist on this application');
        }
        application.assignees = application.assignees.filter((a) => a.id !== assigneeId);
        return await this.applicationRepo.save(application);
    }
    async updateAnswerStatus(id, status, feedback) {
        const answer = await this.answerRepo.findOne(id, {
            relations: ['application'],
        });
        if (!answer)
            throw new common_1.NotFoundException('Answer not found');
        answer.status = status;
        if (feedback)
            answer.feedback = feedback;
        await this.answerRepo.save(answer);
        return await this.findOne({ where: { id: answer.application.id } });
    }
    async reviewAnswers(id, dto) {
        if (!(await this.applicationRepo.findOne({ where: { id } })))
            throw new common_1.NotFoundException('Application not found');
        for (const el of dto.answers) {
            const answer = await this.answerRepo.findOne({
                where: { id: el.id, application: { id } },
            });
            if (answer) {
                answer.status = el.status;
                if (el.feedback)
                    answer.feedback = el.feedback;
                await this.answerRepo.save(answer);
            }
        }
    }
    async submit(id, user) {
        try {
            const application = await this.findOne({ where: { id } });
            if (user.id !== application.applicant.id)
                throw new common_1.BadRequestException("You cannot submit someone else's application");
            if (application.status !== enums_2.EApplicationStatus.DENIED &&
                application.submittedAt)
                throw new common_1.BadRequestException('This application has already been submitted');
            application.submittedAt = new Date();
            application.status = enums_2.EApplicationStatus.SUBMITTED;
            if (application.certificate && application.certificate.isRenewing)
                this.certificateService.renewCertificate(application.certificate.uniqueId);
            await this.applicationRepo.save(application);
            const submissionEmail = {
                to: user.email,
                subject: 'Trust seal application submission.',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello ${user.name}, your application has been submitted`,
                html: (0, submission_email_1.SubmissionEmailTemplate)(),
            };
            this.sendgridService
                .send(submissionEmail)
                .catch((e) => common_1.Logger.error(e));
            const admins = await this.userRepo.find({
                where: { role: roles_enum_1.Roles.DBI_ADMIN },
            });
            for (const admin of admins) {
                const adminSubmissionNotificationEmail = {
                    to: admin.email,
                    subject: 'Trust seal application submission.',
                    from: this.configService.get('sendgrid').fromEmail,
                    text: `Hello ${user.name}, an application has been submitted`,
                    html: (0, submission_email_1.AdminSubmissionNotificationEmailTemplate)(admin.name, application.applicant.name, this.configService.get('web').adminUrl),
                };
                this.sendgridService
                    .send(adminSubmissionNotificationEmail)
                    .catch((e) => common_1.Logger.error(e));
            }
        }
        catch (error) {
            common_1.Logger.error(error);
            throw error;
        }
    }
    async joinInterview(applicationId, user) {
        try {
            const application = await this.findOne({
                where: { id: applicationId },
            });
            if (user.id !== application.applicant.id) {
                throw new common_1.BadRequestException("You cannot join an interview for someone else's application");
            }
            if (application.status !== enums_2.EApplicationStatus.FIRST_STAGE_PASSED &&
                application.status !== enums_2.EApplicationStatus.SUBMITTED) {
                throw new common_1.BadRequestException('Interview is only available for applications that have passed the first stage or have been submitted');
            }
            common_1.Logger.log(`User ${user.id} joined interview for application ${applicationId}`);
        }
        catch (error) {
            common_1.Logger.error(error);
            throw error;
        }
    }
    async remove(id) {
        await this.findOne({ where: { id } });
        await this.applicationRepo.softDelete(id);
    }
    async exportAllAnswersToExcel(categoryId, year) {
        common_1.Logger.log('Exporting all answers to Excel started');
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
        common_1.Logger.log(`Found ${answers.length} answers`);
        common_1.Logger.log('Creating Excel workbook');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        const questions = new Set(answers.map((answer) => answer.question_text));
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
        common_1.Logger.log('Adding rows to Excel workbook');
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
        const buffer = await workbook.xlsx.writeBuffer();
        common_1.Logger.log('Exporting all answers completed');
        return {
            fileName: 'Answers.xlsx',
            buffer,
        };
    }
};
ApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(section_entity_1.Section)),
    __param(3, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(4, (0, typeorm_1.InjectRepository)(answer_entity_1.Answer)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sendgrid_service_1.SendGridService,
        config_1.ConfigService,
        certificate_service_1.CertificateService,
        typeorm_2.Connection])
], ApplicationService);
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=application.service.js.map