import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../application/entities/application.entity';
import { Category } from '../category/entities/category.entity';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PindoService } from './pindo.service';
import { MailerService } from './mailtrap.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, Application, Category]),
        HttpModule,
    ],
    controllers: [NotificationController],
    providers: [NotificationService, PindoService, MailerService],
})
export class NotificationModule {}
