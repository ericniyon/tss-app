"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
require("dotenv/config");
const pindo_service_1 = require("../notification/pindo.service");
const sendgrid_service_1 = require("../notification/sendgrid.service");
const PasswordEncryption_1 = require("../shared/utils/PasswordEncryption");
const user_entity_1 = require("../users/entities/user.entity");
const users_module_1 = require("../users/users.module");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const auth_otp_entity_1 = require("./entities/auth-otp.entity");
const jwt_strategy_1 = require("./jwt.strategy");
const refresh_jwt_strategy_1 = require("./refresh-jwt.strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, auth_otp_entity_1.AuthOtp]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            passport_1.PassportModule,
            axios_1.HttpModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    publicKey: configService.get('jwt').publicKey,
                    privateKey: configService.get('jwt').privateKey,
                    signOptions: {
                        expiresIn: configService.get('jwt').expiresIn,
                        issuer: 'tss-api',
                        algorithm: 'RS256',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            refresh_jwt_strategy_1.JwtRefreshStrategy,
            PasswordEncryption_1.PasswordEncryption,
            pindo_service_1.PindoService,
            config_1.ConfigService,
            sendgrid_service_1.SendGridService,
        ],
        exports: [jwt_1.JwtModule, auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map