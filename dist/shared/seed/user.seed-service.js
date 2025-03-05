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
exports.UserSeedService = void 0;
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const roles_enum_1 = require("../enums/roles.enum");
const env_util_1 = require("../utils/env.util");
const PasswordEncryption_1 = require("../utils/PasswordEncryption");
let UserSeedService = class UserSeedService {
    constructor(entityManager, passwordEncryption, configService) {
        this.entityManager = entityManager;
        this.passwordEncryption = passwordEncryption;
        this.configService = configService;
    }
    async seed() {
        if (!(await this.entityManager.findOne(user_entity_1.User, {
            email: 'admin@dbi.rw',
        }))) {
            const user = new user_entity_1.User();
            user.email = 'admin@dbi.rw';
            user.password = await this.passwordEncryption.hashPassword(this.configService.get('defaultPassword'));
            user.name = 'TSS Admin';
            user.phone = '+250784210000';
            user.role = roles_enum_1.Roles.DBI_ADMIN;
            user.activated = true;
            user.verified = true;
            await this.entityManager.save(user_entity_1.User, user);
        }
        if ((0, env_util_1.isRunningInDevelopment)()) {
            if (!(await this.entityManager.findOne(user_entity_1.User, {
                email: 'expert@dbi.rw',
            }))) {
                const user = new user_entity_1.User();
                user.email = 'expert@dbi.rw';
                user.password = await this.passwordEncryption.hashPassword(this.configService.get('defaultPassword'));
                user.name = 'TSS Expert';
                user.phone = '+250784210001';
                user.role = roles_enum_1.Roles.DBI_EXPERT;
                user.activated = true;
                user.verified = true;
                await this.entityManager.save(user_entity_1.User, user);
            }
            if (!(await this.entityManager.findOne(user_entity_1.User, {
                email: 'techsupport@dbi.rw',
            }))) {
                const user = new user_entity_1.User();
                user.email = 'techsupport@dbi.rw';
                user.password = await this.passwordEncryption.hashPassword(this.configService.get('defaultPassword'));
                user.name = 'TSS Support';
                user.phone = '+250784210002';
                user.role = roles_enum_1.Roles.TECH_SUPPORT;
                user.activated = true;
                user.verified = true;
                await this.entityManager.save(user_entity_1.User, user);
            }
            const company1Exist = await this.entityManager.findOne(user_entity_1.User, {
                email: 'company@awesomity.rw',
            });
            if (!company1Exist) {
                const user = new user_entity_1.User();
                user.email = 'company@awesomity.rw';
                user.password = await this.passwordEncryption.hashPassword(this.configService.get('defaultPassword'));
                user.name = 'Awesomity Lab';
                user.phone = '+250781468560';
                user.role = roles_enum_1.Roles.COMPANY;
                user.activated = true;
                user.verified = true;
                await this.entityManager.save(user_entity_1.User, user);
            }
            const testCompanyExist = await this.entityManager.findOne(user_entity_1.User, {
                email: 'test@awesomity.rw',
            });
            if (!testCompanyExist) {
                const user = new user_entity_1.User();
                user.email = 'test@awesomity.rw';
                user.password = await this.passwordEncryption.hashPassword(this.configService.get('defaultPassword'));
                user.name = 'Awesomity Lab';
                user.phone = '+250780000000';
                user.role = roles_enum_1.Roles.COMPANY;
                user.activated = true;
                user.verified = true;
                await this.entityManager.save(user_entity_1.User, user);
            }
            if ((await this.entityManager.count(user_entity_1.User, {
                role: (0, typeorm_1.Any)([roles_enum_1.Roles.DBI_EXPERT, roles_enum_1.Roles.COMPANY]),
            })) < 20) {
                for (const _i of Array(10).fill('i')) {
                    const expertEmail = faker_1.faker.internet.email();
                    const expertExist = await this.entityManager.findOne(user_entity_1.User, {
                        email: expertEmail,
                    });
                    if (!expertExist) {
                        const user = new user_entity_1.User();
                        user.email = expertEmail;
                        user.password =
                            await this.passwordEncryption.hashPassword(this.configService.get('defaultPassword'));
                        user.name = `${faker_1.faker.name.firstName()} ${faker_1.faker.name.lastName()}`;
                        user.phone =
                            faker_1.faker.phone.phoneNumber('+250 78# ### ###');
                        user.role = roles_enum_1.Roles.DBI_EXPERT;
                        user.activated = true;
                        user.verified = true;
                        await this.entityManager.save(user_entity_1.User, user);
                    }
                    const companyEmail = faker_1.faker.internet.email();
                    const companyExist = await this.entityManager.findOne(user_entity_1.User, {
                        email: companyEmail,
                    });
                    if (!companyExist) {
                        const user = new user_entity_1.User();
                        user.email = companyEmail;
                        user.password =
                            await this.passwordEncryption.hashPassword(this.configService.get('defaultPassword'));
                        user.name = `${faker_1.faker.name.firstName()} ${faker_1.faker.name.lastName()}`;
                        user.phone =
                            faker_1.faker.phone.phoneNumber('+250 78# ### ###');
                        user.role = roles_enum_1.Roles.COMPANY;
                        user.activated = true;
                        user.verified = true;
                        await this.entityManager.save(user_entity_1.User, user);
                    }
                }
            }
        }
    }
};
UserSeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager,
        PasswordEncryption_1.PasswordEncryption,
        config_1.ConfigService])
], UserSeedService);
exports.UserSeedService = UserSeedService;
//# sourceMappingURL=user.seed-service.js.map