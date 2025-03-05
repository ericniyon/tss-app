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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_constant_1 = require("../shared/constant/auth.constant");
const decorators_1 = require("../shared/decorators");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const user_entity_1 = require("../users/entities/user.entity");
const auth_service_1 = require("./auth.service");
const auth_decorator_1 = require("./decorators/auth.decorator");
const get_user_decorator_1 = require("./decorators/get-user.decorator");
const change_password_dto_1 = require("./dto/change-password.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const login_dto_1 = require("./dto/login.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const jwt_refresh_guard_1 = require("./guards/jwt-refresh.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async registerCompany(createUserDto) {
        await this.authService.register(createUserDto);
        return { message: 'You successfully registered', results: null };
    }
    async verification(code) {
        await this.authService.verification(code);
        return {
            message: 'You verified your account successfully',
            results: null,
        };
    }
    async resendVerification(resendVerificationDto) {
        await this.authService.resendVerification(resendVerificationDto);
        return { message: 'You successfully registered', results: null };
    }
    async login(loginDto, response) {
        const { accessToken, refreshToken } = await this.authService.login(loginDto, true);
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
    async loginCompany(loginDto, response) {
        const { accessToken, refreshToken } = await this.authService.login(loginDto);
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
    async changePassword(user, changePasswordDto) {
        const results = await this.authService.changePassword(user, changePasswordDto);
        return { message: 'Password has changed successfully', results };
    }
    async resetEmail(resetPasswordRequestDto) {
        const results = await this.authService.forgotPassword(resetPasswordRequestDto);
        return { message: auth_constant_1.RESET_EMAIL_SENT, results };
    }
    async resetPassword(resetPasswordDto) {
        await this.authService.resetPassword(resetPasswordDto);
        return { message: auth_constant_1.RESET_PASSWORD_SUCCESS };
    }
    async getProfile(user) {
        const results = await this.authService.getProfile(user);
        return { message: 'Profile retrieved successfully', results };
    }
    async updateProfile(user, updateProfileDto) {
        const result = await this.authService.updateProfile(user, updateProfileDto);
        return {
            message: `Profile updated successfully. ${result && 'Verification email sent'}`,
        };
    }
    async updateEmail(token) {
        await this.authService.updateEmailFromToken(token);
        return {
            message: 'Email updated successfully',
            results: null,
        };
    }
    async refreshToken(response, user) {
        const { accessToken, refreshToken } = await this.authService.refreshToken(user);
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
    async logout(response, user) {
        await this.authService.logout(user);
        response.clearCookie('tss_jwt');
        response.clearCookie('tss_refresh_jwt');
        return {
            message: 'Logged out successfully',
        };
    }
};
__decorate([
    (0, common_1.Post)('/register'),
    (0, decorators_1.CreatedResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.ConflictResponse, decorators_1.BadRequestResponse),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerCompany", null);
__decorate([
    (0, common_1.Get)('/verify'),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.UnauthorizedResponse, decorators_1.BadRequestResponse),
    (0, decorators_1.QueryParam)('code'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verification", null);
__decorate([
    (0, common_1.Post)('/resend-verification'),
    (0, decorators_1.CreatedResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.ConflictResponse, decorators_1.BadRequestResponse),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.UnauthorizedResponse, decorators_1.BadRequestResponse),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/company-login'),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.UnauthorizedResponse, decorators_1.BadRequestResponse),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginCompany", null);
__decorate([
    (0, common_1.Post)('/change-password'),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.BadRequestResponse),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('/forgot-password'),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.NotFoundResponse, decorators_1.BadRequestResponse),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetEmail", null);
__decorate([
    (0, common_1.Patch)('/reset-password/'),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.NotFoundResponse, decorators_1.BadRequestResponse),
    (0, decorators_1.QueryParam)('token', false),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('/get-profile/'),
    (0, decorators_1.OkResponse)(user_entity_1.User),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('/update-profile/'),
    (0, decorators_1.Operation)('Updates profile and sends a verification email in case a user updates the email'),
    (0, decorators_1.OkResponse)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('/update-email'),
    (0, decorators_1.Operation)('Updates email from valid token received through a link to the email'),
    (0, decorators_1.OkResponse)(),
    (0, decorators_1.ErrorResponses)(decorators_1.UnauthorizedResponse, decorators_1.BadRequestResponse),
    (0, decorators_1.QueryParam)('token'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateEmail", null);
__decorate([
    (0, common_1.Get)('/refresh-token'),
    (0, decorators_1.OkResponse)(),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.UseGuards)(jwt_refresh_guard_1.default),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('/logout'),
    (0, decorators_1.OkResponse)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, swagger_1.ApiExtraModels)(user_entity_1.User),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map