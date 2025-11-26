import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import 'dotenv/config';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                // Try cookie first
                (request: Request): string | null => {
                    const token = request?.cookies?.tss_jwt;
                    // Return null explicitly to allow next extractor to try
                    return token ? token : null;
                },
                // Fallback to Authorization header (Bearer token)
                (request: Request): string | null => {
                    const authHeader = request?.headers?.authorization;
                    if (authHeader && authHeader.startsWith('Bearer ')) {
                        return authHeader.substring(7);
                    }
                    return null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt').publicKey,
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        const user = await this.userRepository.findOne({ id: id });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
