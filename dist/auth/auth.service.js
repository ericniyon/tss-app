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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const omit = require("lodash.omit");
const pick = require("lodash.pick");
const typeorm_2 = require("typeorm");
const pindo_service_1 = require("../notification/pindo.service");
const sendgrid_service_1 = require("../notification/sendgrid.service");
const otp_type_enum_1 = require("../shared/enums/otp-type.enum");
const roles_enum_1 = require("../shared/enums/roles.enum");
const forgot_password_email_1 = require("../shared/templates/forgot-password-email");
const verification_email_1 = require("../shared/templates/verification-email");
const code_generator_1 = require("../shared/utils/code-generator");
const PasswordEncryption_1 = require("../shared/utils/PasswordEncryption");
const user_entity_1 = require("../users/entities/user.entity");
const auth_otp_entity_1 = require("./entities/auth-otp.entity");
let AuthService = class AuthService {
    constructor(jwtService, passwordEncryption, userRepository, connection, pindoService, otpRepository, configService, sendGridService) {
        this.jwtService = jwtService;
        this.passwordEncryption = passwordEncryption;
        this.userRepository = userRepository;
        this.connection = connection;
        this.pindoService = pindoService;
        this.otpRepository = otpRepository;
        this.configService = configService;
        this.sendGridService = sendGridService;
    }
    async register(createUserDto) {
        createUserDto.password = await this.passwordEncryption.hashPassword(createUserDto.password);
        await this.connection.transaction(async (manager) => {
            if (await manager.findOne(user_entity_1.User, {
                where: { email: createUserDto.email },
            }))
                throw new common_1.BadRequestException('Account already exists');
            if (await manager.findOne(user_entity_1.User, {
                where: { phone: createUserDto.phone },
            }))
                throw new common_1.BadRequestException('Phone already exists');
            const verificationCode = (0, code_generator_1.codeGenerator)();
            const user = await manager.save(user_entity_1.User, Object.assign(Object.assign({}, createUserDto), { role: roles_enum_1.Roles.COMPANY }));
            const otpData = {
                otp: verificationCode,
                otpType: otp_type_enum_1.OtpType.VERIFY_ACCOUNT,
                expirationTime: this.setExpiration(1),
                previousPassword: createUserDto.password,
                user: user,
            };
            await manager.save(auth_otp_entity_1.AuthOtp, otpData);
            await this.sendVerification(user, verificationCode);
        });
    }
    async resendVerification(resendVerificationDto) {
        const user = await this.userRepository.findOne({
            email: resendVerificationDto.email,
        });
        if (!user)
            throw new common_1.NotFoundException('This account does not exist');
        if (user.verified)
            throw new common_1.BadRequestException('Your account is already verified');
        let otp = await this.otpRepository.findOne({
            user,
            otpType: otp_type_enum_1.OtpType.VERIFY_ACCOUNT,
        });
        const verificationCode = (0, code_generator_1.codeGenerator)();
        if (otp) {
            otp = await this.otpRepository.save(Object.assign(Object.assign({}, otp), { otp: verificationCode, expirationTime: this.setExpiration(1) }));
        }
        else {
            otp = await this.otpRepository.save(Object.assign(Object.assign({}, new auth_otp_entity_1.AuthOtp()), { otp: verificationCode, expirationTime: this.setExpiration(1), otpType: otp_type_enum_1.OtpType.VERIFY_ACCOUNT, user: user }));
        }
        await this.sendVerification(user, otp.otp);
    }
    async sendVerification(user, verificationCode) {
        const verificationLink = `${this.configService.get('web').clientUrl}/verify`;
        const verificationMail = {
            to: user.email,
            subject: 'Trust seal verify account',
            from: this.configService.get('sendgrid').fromEmail,
            text: `Hello ${user.name} verify the account`,
            html: (0, verification_email_1.VerificationEmailTemplate)(user.name, verificationLink, verificationCode),
        };
        await this.sendGridService.send(verificationMail);
        await this.pindoService.send(user.phone, `Dear ${user.name} Team, use the code below to verify your DBI trust seal account.
            ${verificationCode}`);
    }
    async verification(code) {
        const result = await this.otpRepository.findOne({
            where: { otp: code },
            relations: ['user'],
        });
        if (!result) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (result.user.verified) {
            throw new common_1.BadRequestException('Your account is already verified');
        }
        const isCodeExpired = await this.checkCodeExpiry(result);
        if (isCodeExpired) {
            throw new common_1.BadRequestException('Verification code has expired');
        }
        await this.userRepository.update({ id: result.user.id }, { verified: true });
        await this.otpRepository.delete({ otp: code });
    }
    async login(loginDto, isDashboard) {
        const { username, password } = loginDto;
        const user = await this.userRepository.findOne({
            email: username,
            role: isDashboard
                ? (0, typeorm_2.Any)([roles_enum_1.Roles.DBI_ADMIN, roles_enum_1.Roles.DBI_EXPERT, roles_enum_1.Roles.TECH_SUPPORT])
                : roles_enum_1.Roles.COMPANY,
        });
        if (!user) {
            throw new common_1.BadRequestException('The email or password is incorrect');
        }
        else {
            const isMatch = await this.passwordEncryption.comparePassword(password, user.password);
            if (!isMatch) {
                throw new common_1.BadRequestException('The email or password is incorrect');
            }
            if (!user.verified) {
                throw new common_1.BadRequestException('The account is not verified');
            }
            if (!user.activated) {
                throw new common_1.BadRequestException('The account is deactivated, Please contact administrator for support');
            }
            const accessToken = await this.jwtService.signAsync({
                id: user.id,
                role: user.role,
            });
            const refreshToken = await this.jwtService.signAsync({
                id: user.id,
            });
            user.refreshToken = refreshToken;
            await this.userRepository.save(user);
            return {
                accessToken,
                refreshToken,
            };
        }
    }
    async changePassword(user, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const result = await this.userRepository.findOne({ id: user.id });
        const isMatch = await this.passwordEncryption.comparePassword(currentPassword, user.password);
        if (currentPassword === newPassword)
            throw new common_1.BadRequestException(`Current password can't be equal to the new password `);
        if (!isMatch) {
            throw new common_1.BadRequestException(`Provided current password is not equal to the old password`);
        }
        const hash = await this.passwordEncryption.hashPassword(newPassword);
        const updatedUser = await this.userRepository.save(Object.assign(Object.assign({}, result), { password: hash }));
        return pick(updatedUser, [
            'email',
            'name',
            'phone',
            'verified',
            'role',
        ]);
    }
    async forgotPassword(resetPasswordRequestDto) {
        const { email } = resetPasswordRequestDto;
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new common_1.NotFoundException('User with this email not found');
        }
        const resetPasswordCode = (0, code_generator_1.codeGenerator)();
        const passwordTokenData = {
            otp: resetPasswordCode,
            otpType: otp_type_enum_1.OtpType.RESET_PASSWORD,
            expirationTime: this.setExpiration(1),
            user: user,
        };
        const forgotPasswordToken = await this.jwtService.signAsync({
            id: user.id,
            role: user.role,
        });
        const savedToken = await this.otpRepository.save(passwordTokenData);
        if (!savedToken)
            throw new common_1.InternalServerErrorException();
        const resetPasswordLink = `${user.role !== roles_enum_1.Roles.COMPANY
            ? this.configService.get('web').adminUrl
            : this.configService.get('web').clientUrl}/reset-password/?token=${forgotPasswordToken}`;
        const forgotPasswordEmail = {
            to: user.email,
            subject: 'Reset password',
            from: this.configService.get('sendgrid').fromEmail,
            text: `Hello  ${user.name}, you can now reset your password`,
            html: (0, forgot_password_email_1.ForgotPasswordEmailTemplate)(user.name, resetPasswordLink, resetPasswordCode),
        };
        await this.sendGridService.send(forgotPasswordEmail);
        return {
            resetToken: forgotPasswordToken,
            resetCode: resetPasswordCode,
        };
    }
    async resetPassword(resetPasswordDto) {
        const { password, token } = resetPasswordDto;
        const otp = await this.otpRepository.findOne({
            where: { otp: token },
            relations: ['user'],
        });
        if (!otp)
            throw new common_1.NotFoundException('OTP token not found');
        const newHash = await this.passwordEncryption.hashPassword(password);
        await this.userRepository.update({ id: (await otp).user.id }, { password: newHash });
        await this.otpRepository.delete({ id: otp.id });
    }
    async getProfile(user) {
        return await this.userRepository.findOne({
            id: user.id,
        });
    }
    async updateProfile(loggedInUser, updateProfileDto) {
        let emailSent = false;
        let profile = await this.getProfile(loggedInUser);
        if (!profile)
            throw new common_1.BadRequestException('This account does not exist');
        if (updateProfileDto.email &&
            (await this.userRepository.findOne({
                id: (0, typeorm_2.Not)(loggedInUser.id),
                email: updateProfileDto.email,
            })))
            throw new common_1.ConflictException('This email is already taken');
        profile = Object.assign(Object.assign({}, profile), omit(updateProfileDto, ['email']));
        await this.userRepository.save(profile);
        if (updateProfileDto.email) {
            const verifyEmailToken = await this.jwtService.signAsync({
                id: profile.id,
                newEmail: updateProfileDto.email,
            }, { expiresIn: '1d' });
            const verificationLink = `${loggedInUser.role === roles_enum_1.Roles.COMPANY
                ? this.configService.get('web').clientUrl
                : this.configService.get('web').adminUrl}/verify-email?token=${verifyEmailToken}`;
            const verificationMail = {
                to: updateProfileDto.email,
                subject: 'Trust seal verify new email',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello ${profile.name} verify your new email`,
                html: (0, verification_email_1.UpdateEmailVerificationTemplate)(profile.name, verificationLink),
            };
            await this.sendGridService.send(verificationMail);
            emailSent = true;
        }
        return emailSent;
    }
    async updateEmailFromToken(token) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token);
        }
        catch (error) {
            common_1.Logger.error(error);
            throw new common_1.BadRequestException((error === null || error === void 0 ? void 0 : error.message) || 'Invalid token');
        }
        const user = await this.userRepository.findOne({ id: payload.id });
        if (!user)
            throw new common_1.NotFoundException('Invalid request: User not found');
        user.email = payload.newEmail;
        await this.userRepository.save(user);
    }
    setExpiration(days) {
        const dt = new Date();
        dt.setDate(dt.getDate() + days);
        return dt;
    }
    async checkCodeExpiry(codeInstance) {
        const expireDate = new Date(codeInstance.expirationTime);
        const now = new Date();
        if (now > expireDate) {
            await this.otpRepository.delete({
                id: codeInstance.id,
            });
            return true;
        }
        return false;
    }
    async refreshToken({ id, role, refreshToken, }) {
        return {
            accessToken: await this.jwtService.signAsync({
                id,
                role,
            }),
            refreshToken,
        };
    }
    async logout({ id }) {
        const user = await this.userRepository.findOne(id);
        user.refreshToken = null;
        await this.userRepository.save(user);
        return;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(auth_otp_entity_1.AuthOtp)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        PasswordEncryption_1.PasswordEncryption,
        typeorm_2.Repository,
        typeorm_2.Connection,
        pindo_service_1.PindoService,
        typeorm_2.Repository,
        config_1.ConfigService,
        sendgrid_service_1.SendGridService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map