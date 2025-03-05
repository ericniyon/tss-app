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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationSeedService = void 0;
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const application_service_1 = require("../../application/application.service");
const answer_entity_1 = require("../../application/entities/answer.entity");
const application_entity_1 = require("../../application/entities/application.entity");
const enums_1 = require("../../application/enums");
const category_entity_1 = require("../../category/entities/category.entity");
const certificate_entity_1 = require("../../certificate/entities/certificate.entity");
const enums_2 = require("../../question/enums");
const user_entity_1 = require("../../users/entities/user.entity");
const roles_enum_1 = require("../enums/roles.enum");
const company_id_generator_1 = require("../utils/company-id-generator");
let ApplicationSeedService = class ApplicationSeedService {
    constructor(entityManager, applicationService) {
        this.entityManager = entityManager;
        this.applicationService = applicationService;
    }
    async seed() {
        if ((await this.entityManager.count(application_entity_1.Application)) < 50) {
            const categories = await this.entityManager.find(category_entity_1.Category, {
                take: 5,
                where: { active: true },
            });
            const user = await this.entityManager.findOne(user_entity_1.User, {
                where: { email: 'company@awesomity.rw' },
            });
            if (!(await this.entityManager.count(application_entity_1.Application, {
                where: {
                    applicant: user,
                    status: (0, typeorm_1.Any)([
                        enums_1.EApplicationStatus.PENDING,
                        enums_1.EApplicationStatus.FIRST_STAGE_PASSED,
                    ]),
                },
            })))
                await this.createApplication(enums_1.EApplicationStatus.PENDING, user, categories);
            await this.createApplication(enums_1.EApplicationStatus.APPROVED, user, categories);
            const [companies, companiesCount] = await this.entityManager.findAndCount(user_entity_1.User, {
                where: {
                    role: roles_enum_1.Roles.COMPANY,
                    email: (0, typeorm_1.Not)('test@awesomity.rw'),
                },
            });
            const thisCompany = companies[faker_1.default.datatype.number(companiesCount - 1)];
            if (!(await this.entityManager.count(application_entity_1.Application, {
                where: {
                    applicant: thisCompany,
                    status: (0, typeorm_1.Any)([
                        enums_1.EApplicationStatus.PENDING,
                        enums_1.EApplicationStatus.FIRST_STAGE_PASSED,
                    ]),
                },
            })))
                await this.createApplication(enums_1.EApplicationStatus.PENDING, thisCompany, categories);
            for (const [i, v] of Array(10).fill(null).entries()) {
                await this.createApplication(enums_1.EApplicationStatus.SUBMITTED, companies[faker_1.default.datatype.number(companiesCount - 1)], categories);
            }
            for (const [i, v] of Array(10).fill(null).entries()) {
                await this.createApplication(enums_1.EApplicationStatus.APPROVED, companies[faker_1.default.datatype.number(companiesCount - 1)], categories);
            }
            for (const [i, v] of Array(10).fill(null).entries()) {
                await this.createApplication(enums_1.EApplicationStatus.FIRST_STAGE_PASSED, companies[faker_1.default.datatype.number(companiesCount - 1)], categories);
            }
        }
    }
    async createApplication(status, user, categories) {
        const application = Object.assign(Object.assign({}, new application_entity_1.Application()), { applicant: user, category: categories[faker_1.default.datatype.number(4)], companyUrl: `https://${faker_1.default.internet.domainName()}`, businessPlatform: enums_1.EPlatform.WEBSITE, status, submittedAt: status !== enums_1.EApplicationStatus.PENDING ? new Date() : null });
        await this.entityManager.save(application_entity_1.Application, application);
        const applicationQuestions = await this.applicationService.findQuestions(application.category.id);
        const answers = [];
        for (const qn of applicationQuestions) {
            answers.push(Object.assign(Object.assign({}, new answer_entity_1.Answer()), { application, attachments: qn.requiresAttachments
                    ? Array(3)
                        .fill('i')
                        .map(() => faker_1.default.image.business())
                    : [], responses: qn.possibleAnswers
                    ? qn.type === enums_2.EType.SINGLE_CHOICE
                        ? [
                            qn.possibleAnswers[faker_1.default.datatype.number(qn.possibleAnswers.length - 1)],
                        ]
                        : [
                            qn.possibleAnswers[faker_1.default.datatype.number(qn.possibleAnswers.length - 1)],
                            qn.possibleAnswers[faker_1.default.datatype.number(qn.possibleAnswers.length - 1)],
                        ]
                    : [faker_1.default.hacker.phrase()], question: qn, questionText: qn.text }));
        }
        await this.entityManager.save(answer_entity_1.Answer, [...answers]);
        if (application.status === enums_1.EApplicationStatus.APPROVED) {
            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            await this.entityManager.save(certificate_entity_1.Certificate, {
                uniqueId: (0, company_id_generator_1.IdGenerator)(application.applicant.name),
                application: application,
                expirationDate,
            });
        }
    }
};
ApplicationSeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager,
        application_service_1.ApplicationService])
], ApplicationSeedService);
exports.ApplicationSeedService = ApplicationSeedService;
//# sourceMappingURL=application.seed-service.js.map