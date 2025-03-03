import { HttpModule } from '@nestjs/axios';
import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { PindoService } from '../notification/pindo.service';
import { SendGridService } from '../notification/sendgrid.service';
import { PasswordEncryption } from '../shared/utils/PasswordEncryption';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthOtp } from './entities/auth-otp.entity';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './refresh-jwt.strategy';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, AuthOtp]),
        forwardRef(() => UsersModule),
        PassportModule,
        HttpModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                publicKey: configService.get('jwt').publicKey,
                privateKey: configService.get('jwt').privateKey,
                signOptions: {
                    expiresIn: configService.get('jwt').expiresIn,
                    issuer: 'tss-api',
                    algorithm: 'RS256',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        JwtRefreshStrategy,
        PasswordEncryption,
        PindoService,
        ConfigService,
        SendGridService,
    ],
    exports: [JwtModule, AuthService],
})
export class AuthModule {}
