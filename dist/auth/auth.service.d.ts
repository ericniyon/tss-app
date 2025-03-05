import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Connection, Repository } from 'typeorm';
import { PindoService } from '../notification/pindo.service';
import { SendGridService } from '../notification/sendgrid.service';
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
export declare class AuthService {
    private readonly jwtService;
    private readonly passwordEncryption;
    private readonly userRepository;
    private readonly connection;
    private readonly pindoService;
    private readonly otpRepository;
    private readonly configService;
    private readonly sendGridService;
    constructor(jwtService: JwtService, passwordEncryption: PasswordEncryption, userRepository: Repository<User>, connection: Connection, pindoService: PindoService, otpRepository: Repository<AuthOtp>, configService: ConfigService, sendGridService: SendGridService);
    register(createUserDto: CreateUserDto): Promise<void>;
    resendVerification(resendVerificationDto: ForgotPasswordDto): Promise<void>;
    private sendVerification;
    verification(code: any): Promise<void>;
    login(loginDto: LoginDto, isDashboard?: boolean): Promise<LoginResponse>;
    changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<Partial<User>>;
    forgotPassword(resetPasswordRequestDto: ForgotPasswordDto): Promise<any>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>;
    getProfile(user: User): Promise<Partial<User>>;
    updateProfile(loggedInUser: User, updateProfileDto: UpdateProfileDto): Promise<boolean>;
    updateEmailFromToken(token: string): Promise<void>;
    setExpiration(days: number): any;
    checkCodeExpiry(codeInstance: AuthOtp): Promise<boolean>;
    refreshToken({ id, role, refreshToken, }: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout({ id }: User): Promise<{
        accessToken: string;
    }>;
}
