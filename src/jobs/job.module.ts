import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from '../certificate/entities/certificate.entity';
import { MailerService } from '../notification/mailtrap.service';
import { JobService } from './job.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Certificate]),
        ScheduleModule.forRoot(),
    ],
    providers: [JobService, MailerService, ConfigService],
})
export class JobModule {}
