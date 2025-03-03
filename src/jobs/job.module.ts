import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from '../certificate/entities/certificate.entity';
import { SendGridService } from '../notification/sendgrid.service';
import { JobService } from './job.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Certificate]),
        ScheduleModule.forRoot(),
    ],
    providers: [JobService, SendGridService, ConfigService],
})
export class JobModule {}
