import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Any, EntityManager } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Roles } from '../enums/roles.enum';
import { isRunningInDevelopment } from '../utils/env.util';
import { PasswordEncryption } from '../utils/PasswordEncryption';

@Injectable()
export class UserSeedService {
    constructor(
        private readonly entityManager: EntityManager,
        private passwordEncryption: PasswordEncryption,
        private configService: ConfigService,
    ) {}

    async seed(): Promise<void> {
        if (
            !(await this.entityManager.findOne(User, {
                email: 'admin@dbi.rw',
            }))
        ) {
            const user = new User();
            user.email = 'admin@dbi.rw';
            user.password = await this.passwordEncryption.hashPassword(
                this.configService.get<string>('defaultPassword'),
            );
            user.name = 'TSS Admin';
            user.phone = '+250784210000';
            user.role = Roles.DBI_ADMIN;
            user.activated = true;
            user.verified = true;
            await this.entityManager.save(User, user);
        }
        if (isRunningInDevelopment()) {
            if (
                !(await this.entityManager.findOne(User, {
                    email: 'expert@dbi.rw',
                }))
            ) {
                const user = new User();
                user.email = 'expert@dbi.rw';
                user.password = await this.passwordEncryption.hashPassword(
                    this.configService.get<string>('defaultPassword'),
                );
                user.name = 'TSS Expert';
                user.phone = '+250784210001';
                user.role = Roles.DBI_EXPERT;
                user.activated = true;
                user.verified = true;
                await this.entityManager.save(User, user);
            }
            if (
                !(await this.entityManager.findOne(User, {
                    email: 'techsupport@dbi.rw',
                }))
            ) {
                const user = new User();
                user.email = 'techsupport@dbi.rw';
                user.password = await this.passwordEncryption.hashPassword(
                    this.configService.get<string>('defaultPassword'),
                );
                user.name = 'TSS Support';
                user.phone = '+250784210002';
                user.role = Roles.TECH_SUPPORT;
                user.activated = true;
                user.verified = true;
                await this.entityManager.save(User, user);
            }
            const company1Exist = await this.entityManager.findOne(User, {
                email: 'company@awesomity.rw',
            });
            if (!company1Exist) {
                const user = new User();
                user.email = 'company@awesomity.rw';
                user.password = await this.passwordEncryption.hashPassword(
                    this.configService.get<string>('defaultPassword'),
                );
                user.name = 'Awesomity Lab';
                user.phone = '+250781468560';
                user.role = Roles.COMPANY;
                user.activated = true;
                user.verified = true;
                await this.entityManager.save(User, user);
            }
            const testCompanyExist = await this.entityManager.findOne(User, {
                email: 'test@awesomity.rw',
            });
            if (!testCompanyExist) {
                const user = new User();
                user.email = 'test@awesomity.rw';
                user.password = await this.passwordEncryption.hashPassword(
                    this.configService.get<string>('defaultPassword'),
                );
                user.name = 'Awesomity Lab';
                user.phone = '+250780000000';
                user.role = Roles.COMPANY;
                user.activated = true;
                user.verified = true;
                await this.entityManager.save(User, user);
            }
            if (
                (await this.entityManager.count(User, {
                    role: Any([Roles.DBI_EXPERT, Roles.COMPANY]),
                })) < 20
            ) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for (const _i of Array(10).fill('i')) {
                    const expertEmail = faker.internet.email();
                    const expertExist = await this.entityManager.findOne(User, {
                        email: expertEmail,
                    });
                    if (!expertExist) {
                        const user = new User();
                        user.email = expertEmail;
                        user.password =
                            await this.passwordEncryption.hashPassword(
                                this.configService.get<string>(
                                    'defaultPassword',
                                ),
                            );
                        user.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
                        user.phone =
                            faker.phone.phoneNumber('+250 78# ### ###');
                        user.role = Roles.DBI_EXPERT;
                        user.activated = true;
                        user.verified = true;
                        await this.entityManager.save(User, user);
                    }
                    const companyEmail = faker.internet.email();
                    const companyExist = await this.entityManager.findOne(
                        User,
                        {
                            email: companyEmail,
                        },
                    );
                    if (!companyExist) {
                        const user = new User();
                        user.email = companyEmail;
                        user.password =
                            await this.passwordEncryption.hashPassword(
                                this.configService.get<string>(
                                    'defaultPassword',
                                ),
                            );
                        user.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
                        user.phone =
                            faker.phone.phoneNumber('+250 78# ### ###');
                        user.role = Roles.COMPANY;
                        user.activated = true;
                        user.verified = true;
                        await this.entityManager.save(User, user);
                    }
                }
            }
        }
    }
}
