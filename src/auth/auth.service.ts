import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as omit from 'lodash.omit';
import * as pick from 'lodash.pick';
import { Any, Connection, Not, Repository } from 'typeorm';
import { PindoService } from '../notification/pindo.service';
import { SendGridService } from '../notification/sendgrid.service';
import { OtpType } from '../shared/enums/otp-type.enum';
import { Roles } from '../shared/enums/roles.enum';
import { ForgotPasswordEmailTemplate } from '../shared/templates/forgot-password-email';
import {
    UpdateEmailVerificationTemplate,
    VerificationEmailTemplate,
} from '../shared/templates/verification-email';
import { codeGenerator } from '../shared/utils/code-generator';
import { PasswordEncryption } from '../shared/utils/PasswordEncryption';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginResponse } from './dto/login-resp.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthOtp } from './entities/auth-otp.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly passwordEncryption: PasswordEncryption,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly connection: Connection,
        private readonly pindoService: PindoService,
        @InjectRepository(AuthOtp)
        private readonly otpRepository: Repository<AuthOtp>,
        private readonly configService: ConfigService,
        private readonly sendGridService: SendGridService,
    ) {}
    async register(createUserDto: CreateUserDto): Promise<void> {
        createUserDto.password = await this.passwordEncryption.hashPassword(
            createUserDto.password,
        );

        await this.connection.transaction(async (manager) => {
            if (
                await manager.findOne(User, {
                    where: { email: createUserDto.email },
                })
            )
                throw new BadRequestException('Account already exists');
            if (
                await manager.findOne(User, {
                    where: { phone: createUserDto.phone },
                })
            )
                throw new BadRequestException('Phone already exists');
            const verificationCode: string = codeGenerator();
            const user = await manager.save(User, {
                ...createUserDto,
                role: Roles.COMPANY,
            });
            const otpData = {
                otp: verificationCode,
                otpType: OtpType.VERIFY_ACCOUNT,
                expirationTime: this.setExpiration(1),
                previousPassword: createUserDto.password,
                user: user,
            };
            await manager.save(AuthOtp, otpData);
            await this.sendVerification(user, verificationCode);
        });
    }

    async resendVerification(
        resendVerificationDto: ForgotPasswordDto,
    ): Promise<void> {
        const user = await this.userRepository.findOne({
            email: resendVerificationDto.email,
        });
        if (!user) throw new NotFoundException('This account does not exist');
        if (user.verified)
            throw new BadRequestException('Your account is already verified');
        let otp = await this.otpRepository.findOne({
            user,
            otpType: OtpType.VERIFY_ACCOUNT,
        });
        const verificationCode = codeGenerator();
        if (otp) {
            otp = await this.otpRepository.save({
                ...otp,
                otp: verificationCode,
                expirationTime: this.setExpiration(1),
            });
        } else {
            otp = await this.otpRepository.save({
                ...new AuthOtp(),
                otp: verificationCode,
                expirationTime: this.setExpiration(1),
                otpType: OtpType.VERIFY_ACCOUNT,
                user: user,
            });
        }
        await this.sendVerification(user, otp.otp);
    }

    private async sendVerification(
        user: User,
        verificationCode?: string,
    ): Promise<void> {
        const verificationLink = `${
            this.configService.get('web').clientUrl
        }/verify`;
        const verificationMail = {
            to: user.email,
            subject: 'Trust seal verify account',
            from: this.configService.get('sendgrid').fromEmail,
            text: `Hello ${user.name} verify the account`,
            html: VerificationEmailTemplate(
                user.name,
                verificationLink,
                verificationCode,
            ),
        };
        await this.sendGridService.send(verificationMail);
        await this.pindoService.send(
            user.phone,
            `Dear ${user.name} Team, use the code below to verify your DBI trust seal account.
            ${verificationCode}`,
        );
    }
    async verification(code: any): Promise<void> {
        const result = await this.otpRepository.findOne({
            where: { otp: code },
            relations: ['user'],
        });
        if (!result) {
            throw new BadRequestException('Invalid verification code');
        }
        if (result.user.verified) {
            throw new BadRequestException('Your account is already verified');
        }
        const isCodeExpired = await this.checkCodeExpiry(result);
        if (isCodeExpired) {
            throw new BadRequestException('Verification code has expired');
        }
        await this.userRepository.update(
            { id: result.user.id },
            { verified: true },
        );
        await this.otpRepository.delete({ otp: code });
    }

    async login(
        loginDto: LoginDto,
        isDashboard?: boolean,
    ): Promise<LoginResponse> {
        const { username, password } = loginDto;
        const user = await this.userRepository.findOne({
            email: username,
            role: isDashboard
                ? Any([Roles.DBI_ADMIN, Roles.DBI_EXPERT, Roles.TECH_SUPPORT])
                : Roles.COMPANY,
        });
        if (!user) {
            throw new BadRequestException('The email or password is incorrect');
        } else {
            const isMatch = await this.passwordEncryption.comparePassword(
                password,
                user.password,
            );
            if (!isMatch) {
                throw new BadRequestException(
                    'The email or password is incorrect',
                );
            }
            if (!user.verified) {
                throw new BadRequestException('The account is not verified');
            }
            if (!user.activated) {
                throw new BadRequestException(
                    'The account is deactivated, Please contact administrator for support',
                );
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

    async changePassword(
        user: User,
        changePasswordDto: ChangePasswordDto,
    ): Promise<Partial<User>> {
        const { currentPassword, newPassword } = changePasswordDto;
        const result = await this.userRepository.findOne({ id: user.id });
        const isMatch = await this.passwordEncryption.comparePassword(
            currentPassword,
            user.password,
        );
        if (currentPassword === newPassword)
            throw new BadRequestException(
                `Current password can't be equal to the new password `,
            );
        if (!isMatch) {
            throw new BadRequestException(
                `Provided current password is not equal to the old password`,
            );
        }
        const hash = await this.passwordEncryption.hashPassword(newPassword);
        const updatedUser = await this.userRepository.save({
            ...result,
            password: hash,
        });
        return pick<User>(updatedUser, [
            'email',
            'name',
            'phone',
            'verified',
            'role',
        ]);
    }

    async forgotPassword(
        resetPasswordRequestDto: ForgotPasswordDto,
    ): Promise<any> {
        const { email } = resetPasswordRequestDto;
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new NotFoundException('User with this email not found');
        }
        const resetPasswordCode: string = codeGenerator();
        const passwordTokenData = {
            otp: resetPasswordCode,
            otpType: OtpType.RESET_PASSWORD,
            expirationTime: this.setExpiration(1),
            user: user,
        };

        const forgotPasswordToken = await this.jwtService.signAsync({
            id: user.id,
            role: user.role,
        });

        const savedToken = await this.otpRepository.save(passwordTokenData);
        if (!savedToken) throw new InternalServerErrorException();
        const resetPasswordLink = `${
            user.role !== Roles.COMPANY
                ? this.configService.get('web').adminUrl
                : this.configService.get('web').clientUrl
        }/reset-password/?token=${forgotPasswordToken}`;
        const forgotPasswordEmail = {
            to: user.email,
            subject: 'Reset password',
            from: this.configService.get('sendgrid').fromEmail,
            text: `Hello  ${user.name}, you can now reset your password`,
            html: ForgotPasswordEmailTemplate(
                user.name,
                resetPasswordLink,
                resetPasswordCode,
            ),
        };
        await this.sendGridService.send(forgotPasswordEmail);
        return {
            resetToken: forgotPasswordToken,
            resetCode: resetPasswordCode,
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
        const { password, token } = resetPasswordDto;

        const otp = await this.otpRepository.findOne({
            where: { otp: token },
            relations: ['user'],
        });
        if (!otp) throw new NotFoundException('OTP token not found');
        const newHash = await this.passwordEncryption.hashPassword(password);
        await this.userRepository.update(
            { id: (await otp).user.id },
            { password: newHash },
        );
        await this.otpRepository.delete({ id: otp.id });
    }

    async getProfile(user: User): Promise<Partial<User>> {
        return await this.userRepository.findOne({
            id: user.id,
        });
    }

    async updateProfile(
        loggedInUser: User,
        updateProfileDto: UpdateProfileDto,
    ): Promise<boolean> {
        let emailSent = false;
        let profile = await this.getProfile(loggedInUser);
        if (!profile)
            throw new BadRequestException('This account does not exist');
        if (
            updateProfileDto.email &&
            (await this.userRepository.findOne({
                id: Not(loggedInUser.id),
                email: updateProfileDto.email,
            }))
        )
            throw new ConflictException('This email is already taken');

        profile = {
            ...profile,
            ...omit(updateProfileDto, ['email']),
        };
        await this.userRepository.save(profile);

        if (updateProfileDto.email) {
            const verifyEmailToken = await this.jwtService.signAsync(
                {
                    id: profile.id,
                    newEmail: updateProfileDto.email,
                },
                { expiresIn: '1d' },
            );

            const verificationLink = `${
                loggedInUser.role === Roles.COMPANY
                    ? this.configService.get('web').clientUrl
                    : this.configService.get('web').adminUrl
            }/verify-email?token=${verifyEmailToken}`;

            const verificationMail = {
                to: updateProfileDto.email,
                subject: 'Trust seal verify new email',
                from: this.configService.get('sendgrid').fromEmail,
                text: `Hello ${profile.name} verify your new email`,
                html: UpdateEmailVerificationTemplate(
                    profile.name,
                    verificationLink,
                ),
            };
            await this.sendGridService.send(verificationMail);
            emailSent = true;
        }
        return emailSent;
    }

    async updateEmailFromToken(token: string): Promise<void> {
        let payload: { id: number; newEmail: string };
        try {
            payload = await this.jwtService.verifyAsync(token);
        } catch (error) {
            Logger.error(error);
            throw new BadRequestException(error?.message || 'Invalid token');
        }
        const user = await this.userRepository.findOne({ id: payload.id });
        if (!user)
            throw new NotFoundException('Invalid request: User not found');
        user.email = payload.newEmail;
        await this.userRepository.save(user);
    }

    setExpiration(days: number): any {
        const dt = new Date();
        dt.setDate(dt.getDate() + days);
        return dt;
    }

    async checkCodeExpiry(codeInstance: AuthOtp): Promise<boolean> {
        // TODO: Add date-fns
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

    async refreshToken({
        id,
        role,
        refreshToken,
    }: User): Promise<{ accessToken: string; refreshToken: string }> {
        return {
            accessToken: await this.jwtService.signAsync({
                id,
                role,
            }),
            refreshToken,
        };
    }

    async logout({ id }: User): Promise<{ accessToken: string }> {
        const user = await this.userRepository.findOne(id);
        user.refreshToken = null;
        await this.userRepository.save(user);
        return;
    }
}
