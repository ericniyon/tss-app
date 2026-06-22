import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MailerService } from '../notification/mailtrap.service';
import { PasswordEncryption } from '../shared/utils/PasswordEncryption';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
    controllers: [UsersController],
    providers: [
        UsersService,
        ConfigService,
        MailerService,
        PasswordEncryption,
    ],
})
export class UsersModule {}
