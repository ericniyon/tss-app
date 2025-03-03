import faker from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Any, EntityManager, Not } from 'typeorm';
import { ApplicationService } from '../../application/application.service';
import { Answer } from '../../application/entities/answer.entity';
import { Application } from '../../application/entities/application.entity';
import { EApplicationStatus, EPlatform } from '../../application/enums';
import { Category } from '../../category/entities/category.entity';
import { Certificate } from '../../certificate/entities/certificate.entity';
import { EType } from '../../question/enums';
import { User } from '../../users/entities/user.entity';
import { Roles } from '../enums/roles.enum';
import { IdGenerator } from '../utils/company-id-generator';

@Injectable()
export class ApplicationSeedService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly applicationService: ApplicationService,
    ) {}

    async seed(): Promise<void> {
        if ((await this.entityManager.count(Application)) < 50) {
            const categories = await this.entityManager.find(Category, {
                take: 5,
                where: { active: true },
            });
            const user = await this.entityManager.findOne(User, {
                where: { email: 'company@awesomity.rw' },
            });
            if (
                !(await this.entityManager.count(Application, {
                    where: {
                        applicant: user,
                        status: Any([
                            EApplicationStatus.PENDING,
                            EApplicationStatus.FIRST_STAGE_PASSED,
                        ]),
                    },
                }))
            )
                await this.createApplication(
                    EApplicationStatus.PENDING,
                    user,
                    categories,
                );
            await this.createApplication(
                EApplicationStatus.APPROVED,
                user,
                categories,
            );
            const [companies, companiesCount] =
                await this.entityManager.findAndCount(User, {
                    where: {
                        role: Roles.COMPANY,
                        email: Not('test@awesomity.rw'),
                    },
                });
            const thisCompany =
                companies[faker.datatype.number(companiesCount - 1)];
            if (
                !(await this.entityManager.count(Application, {
                    where: {
                        applicant: thisCompany,
                        status: Any([
                            EApplicationStatus.PENDING,
                            EApplicationStatus.FIRST_STAGE_PASSED,
                        ]),
                    },
                }))
            )
                await this.createApplication(
                    EApplicationStatus.PENDING,
                    thisCompany,
                    categories,
                );

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const [i, v] of Array(10).fill(null).entries()) {
                await this.createApplication(
                    EApplicationStatus.SUBMITTED,
                    companies[faker.datatype.number(companiesCount - 1)],
                    categories,
                );
            }
            for (const [i, v] of Array(10).fill(null).entries()) {
                await this.createApplication(
                    EApplicationStatus.APPROVED,
                    companies[faker.datatype.number(companiesCount - 1)],
                    categories,
                );
            }
            for (const [i, v] of Array(10).fill(null).entries()) {
                await this.createApplication(
                    EApplicationStatus.FIRST_STAGE_PASSED,
                    companies[faker.datatype.number(companiesCount - 1)],
                    categories,
                );
            }
        }
    }

    async createApplication(
        status: EApplicationStatus,
        user: User,
        categories: Category[],
    ): Promise<void> {
        const application: Application = {
            ...new Application(),
            applicant: user,
            category: categories[faker.datatype.number(4)],
            companyUrl: `https://${faker.internet.domainName()}`,
            businessPlatform: EPlatform.WEBSITE,
            status,
            submittedAt:
                status !== EApplicationStatus.PENDING ? new Date() : null,
        };
        await this.entityManager.save(Application, application);
        const applicationQuestions =
            await this.applicationService.findQuestions(
                application.category.id,
            );
        const answers: Answer[] = [];
        for (const qn of applicationQuestions) {
            answers.push({
                ...new Answer(),
                application,
                attachments: qn.requiresAttachments
                    ? Array(3)
                          .fill('i')
                          .map(() => faker.image.business())
                    : [],
                responses: qn.possibleAnswers
                    ? qn.type === EType.SINGLE_CHOICE
                        ? [
                              qn.possibleAnswers[
                                  faker.datatype.number(
                                      qn.possibleAnswers.length - 1,
                                  )
                              ],
                          ]
                        : [
                              qn.possibleAnswers[
                                  faker.datatype.number(
                                      qn.possibleAnswers.length - 1,
                                  )
                              ],
                              qn.possibleAnswers[
                                  faker.datatype.number(
                                      qn.possibleAnswers.length - 1,
                                  )
                              ],
                          ]
                    : [faker.hacker.phrase()],
                question: qn,
                questionText: qn.text,
            });
        }
        await this.entityManager.save(Answer, [...answers]);
        if (application.status === EApplicationStatus.APPROVED) {
            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            await this.entityManager.save(Certificate, {
                uniqueId: IdGenerator(application.applicant.name),
                application: application,
                expirationDate,
            });
        }
    }
}
