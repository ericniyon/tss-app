import { Response } from 'express';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerCompany(createUserDto: CreateUserDto): Promise<GenericResponse<any>>;
    verification(code: string): Promise<GenericResponse<any>>;
    resendVerification(resendVerificationDto: ForgotPasswordDto): Promise<GenericResponse<any>>;
    login(loginDto: LoginDto, response: Response): Promise<GenericResponse<{
        refreshToken: string;
    }>>;
    loginCompany(loginDto: LoginDto, response: Response): Promise<GenericResponse<{
        refreshToken: string;
    }>>;
    changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<GenericResponse<any>>;
    resetEmail(resetPasswordRequestDto: ForgotPasswordDto): Promise<GenericResponse<any>>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any>;
    getProfile(user: User): Promise<GenericResponse<Partial<User>>>;
    updateProfile(user: User, updateProfileDto: UpdateProfileDto): Promise<GenericResponse<void>>;
    updateEmail(token: string): Promise<GenericResponse<any>>;
    refreshToken(response: Response, user: User): Promise<GenericResponse<{
        refreshToken: string;
    }>>;
    logout(response: Response, user: User): Promise<GenericResponse<void>>;
}
