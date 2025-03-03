import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
    RESET_EMAIL_SENT,
    RESET_PASSWORD_SUCCESS,
} from '../shared/constant/auth.constant';
import {
    BadRequestResponse,
    ConflictResponse,
    CreatedResponse,
    ErrorResponses,
    NotFoundResponse,
    OkResponse,
    Operation,
    QueryParam,
    UnauthorizedResponse,
} from '../shared/decorators';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import JwtRefreshGuard from './guards/jwt-refresh.guard';

@ApiTags('Authentication')
@ApiExtraModels(User)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @CreatedResponse()
    @ErrorResponses(ConflictResponse, BadRequestResponse)
    async registerCompany(
        @Body() createUserDto: CreateUserDto,
    ): Promise<GenericResponse<any>> {
        await this.authService.register(createUserDto);
        return { message: 'You successfully registered', results: null };
    }

    @Get('/verify')
    @OkResponse()
    @ErrorResponses(UnauthorizedResponse, BadRequestResponse)
    @QueryParam('code')
    async verification(
        @Query('code') code: string,
    ): Promise<GenericResponse<any>> {
        await this.authService.verification(code);
        return {
            message: 'You verified your account successfully',
            results: null,
        };
    }

    @Post('/resend-verification')
    @CreatedResponse()
    @ErrorResponses(ConflictResponse, BadRequestResponse)
    async resendVerification(
        @Body() resendVerificationDto: ForgotPasswordDto,
    ): Promise<GenericResponse<any>> {
        await this.authService.resendVerification(resendVerificationDto);
        return { message: 'You successfully registered', results: null };
    }

    @Post('/login')
    @OkResponse()
    @ErrorResponses(UnauthorizedResponse, BadRequestResponse)
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<GenericResponse<{ refreshToken: string }>> {
        const { accessToken, refreshToken } = await this.authService.login(
            loginDto,
            true,
        );
        response.cookie('tss_jwt', accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        response.cookie('tss_refresh_jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return {
            message: 'You have logged in successfully',
            results: { refreshToken },
        };
    }

    @Post('/company-login')
    @OkResponse()
    @ErrorResponses(UnauthorizedResponse, BadRequestResponse)
    @HttpCode(HttpStatus.OK)
    async loginCompany(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<GenericResponse<{ refreshToken: string }>> {
        const { accessToken, refreshToken } = await this.authService.login(
            loginDto,
        );
        response.cookie('tss_jwt', accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        response.cookie('tss_refresh_jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return {
            message: 'You have logged in successfully',
            results: { refreshToken },
        };
    }

    @Post('/change-password')
    @OkResponse()
    @ErrorResponses(BadRequestResponse)
    @Auth()
    async changePassword(
        @GetUser() user: User,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<GenericResponse<any>> {
        const results = await this.authService.changePassword(
            user,
            changePasswordDto,
        );
        return { message: 'Password has changed successfully', results };
    }

    @Post('/forgot-password')
    @OkResponse()
    @ErrorResponses(NotFoundResponse, BadRequestResponse)
    @HttpCode(HttpStatus.OK)
    async resetEmail(
        @Body() resetPasswordRequestDto: ForgotPasswordDto,
    ): Promise<GenericResponse<any>> {
        const results = await this.authService.forgotPassword(
            resetPasswordRequestDto,
        );
        return { message: RESET_EMAIL_SENT, results };
    }

    @Patch('/reset-password/')
    @OkResponse()
    @ErrorResponses(NotFoundResponse, BadRequestResponse)
    @QueryParam('token', false)
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ): Promise<any> {
        await this.authService.resetPassword(resetPasswordDto);
        return { message: RESET_PASSWORD_SUCCESS };
    }

    @Get('/get-profile/')
    @OkResponse(User)
    @Auth()
    async getProfile(
        @GetUser() user: User,
    ): Promise<GenericResponse<Partial<User>>> {
        const results = await this.authService.getProfile(user);
        return { message: 'Profile retrieved successfully', results };
    }

    @Put('/update-profile/')
    @Operation(
        'Updates profile and sends a verification email in case a user updates the email',
    )
    @OkResponse()
    @Auth()
    async updateProfile(
        @GetUser() user: User,
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<GenericResponse<void>> {
        const result = await this.authService.updateProfile(
            user,
            updateProfileDto,
        );
        return {
            message: `Profile updated successfully. ${
                result && 'Verification email sent'
            }`,
        };
    }

    @Patch('/update-email')
    @Operation(
        'Updates email from valid token received through a link to the email',
    )
    @OkResponse()
    @ErrorResponses(UnauthorizedResponse, BadRequestResponse)
    @QueryParam('token')
    async updateEmail(
        @Query('token') token: string,
    ): Promise<GenericResponse<any>> {
        await this.authService.updateEmailFromToken(token);
        return {
            message: 'Email updated successfully',
            results: null,
        };
    }

    @Get('/refresh-token')
    @OkResponse()
    @ApiCookieAuth()
    @UseGuards(JwtRefreshGuard)
    async refreshToken(
        @Res({ passthrough: true }) response: Response,
        @GetUser() user: User,
    ): Promise<GenericResponse<{ refreshToken: string }>> {
        const { accessToken, refreshToken } =
            await this.authService.refreshToken(user);
        response.cookie('tss_jwt', accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return {
            message: 'Token refreshed successfully',
            results: { refreshToken },
        };
    }

    @Get('/logout')
    @OkResponse()
    @Auth()
    async logout(
        @Res({ passthrough: true }) response: Response,
        @GetUser() user: User,
    ): Promise<GenericResponse<void>> {
        await this.authService.logout(user);
        response.clearCookie('tss_jwt');
        response.clearCookie('tss_refresh_jwt');
        return {
            message: 'Logged out successfully',
        };
    }
}
