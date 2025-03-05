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
exports.JwtRefreshStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
require("dotenv/config");
const passport_jwt_1 = require("passport-jwt");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let JwtRefreshStrategy = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    constructor(userRepository, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => { var _a; return (_a = request === null || request === void 0 ? void 0 : request.cookies) === null || _a === void 0 ? void 0 : _a.tss_refresh_jwt; },
            ]),
            secretOrKey: configService.get('jwt').publicKey,
            passReqToCallback: true,
            ignoreExpiration: true,
        });
        this.userRepository = userRepository;
        this.configService = configService;
    }
    async validate(req, payload) {
        const { id } = payload;
        const user = await this.userRepository.findOne({
            where: { id, refreshToken: req.cookies['tss_refresh_jwt'] },
        });
        if (!user)
            throw new common_1.UnauthorizedException();
        return user;
    }
};
JwtRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], JwtRefreshStrategy);
exports.JwtRefreshStrategy = JwtRefreshStrategy;
//# sourceMappingURL=refresh-jwt.strategy.js.map