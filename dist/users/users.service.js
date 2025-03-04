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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const typeorm_2 = require("typeorm");
const sendgrid_service_1 = require("../notification/sendgrid.service");
const roles_enum_1 = require("../shared/enums/roles.enum");
const confirmation_email_1 = require("../shared/templates/confirmation-email");
const password_generator_1 = require("../shared/utils/password-generator");
const PasswordEncryption_1 = require("../shared/utils/PasswordEncryption");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(userRepository, sendGridService, configService, passwordEncryption) {
        this.userRepository = userRepository;
        this.sendGridService = sendGridService;
        this.configService = configService;
        this.passwordEncryption = passwordEncryption;
    }
    async create(createUserAccountDto) {
        const randPassword = (0, password_generator_1.generatePassword)();
        const password = await this.passwordEncryption.hashPassword(randPassword);
        if (await this.userRepository.findOne({
            where: { email: createUserAccountDto.email },
        }))
            throw new common_1.BadRequestException('Account already exists');
        const results = await this.userRepository.save(Object.assign(Object.assign(Object.assign({}, new user_entity_1.User()), createUserAccountDto), { verified: true, password }));
        const confirmationMail = {
            to: results.email,
            subject: 'Trust seal account confirmation',
            from: this.configService.get('sendgrid').fromEmail,
            text: `Account creation confirmation`,
            html: (0, confirmation_email_1.ConfirmationEmailTemplate)(results.name.split(' ')[0], randPassword, this.configService.get('web').adminUrl),
        };
        await this.sendGridService.send(confirmationMail);
        delete results.password;
        return results;
    }
    async findAll(options) {
        const { items, meta } = await (0, nestjs_typeorm_paginate_1.paginate)(this.userRepository, options, {
            where: {
                role: (0, typeorm_2.Not)(roles_enum_1.Roles.COMPANY),
            },
            order: {
                name: 'ASC',
            },
            select: [
                'id',
                'email',
                'name',
                'phone',
                'verified',
                'activated',
                'role',
            ],
        });
        return Object.assign({ items }, meta);
    }
    async findAllExperts() {
        return await this.userRepository.find({
            where: { role: roles_enum_1.Roles.DBI_EXPERT, activated: true },
            select: ['id', 'name'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            id,
            deletedAt: null,
        });
        if (!user)
            throw new common_1.NotFoundException('User with this id not found');
        return user;
    }
    async activate(id, { email }) {
        const user = await this.findOne(id);
        if (user.email === email)
            throw new common_1.BadRequestException('This operation is not applicable to yourself');
        user.activated = !user.activated;
        if (!user.verified)
            user.verified = true;
        await this.userRepository.save(user);
    }
    async update(id, updateUserAccountDto) {
        await this.findOne(id);
        await this.userRepository.update(id, updateUserAccountDto);
    }
    async remove(id, { email }) {
        const user = await this.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User with this id not found');
        }
        if (user.email === email)
            throw new common_1.BadRequestException('This operation is not applicable to yourself');
        await this.userRepository.softDelete(id);
        await this.userRepository.update(id, { email: `${user.email}${id}` });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sendgrid_service_1.SendGridService,
        config_1.ConfigService,
        PasswordEncryption_1.PasswordEncryption])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map