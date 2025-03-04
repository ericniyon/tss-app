import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Application } from '../application/entities/application.entity';
import { Category } from '../category/entities/category.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { PindoService } from './pindo.service';
import { SendGridService } from './sendgrid.service';
export declare class NotificationService {
    private readonly notificationRepo;
    private readonly applicationRepo;
    private readonly categoryRepo;
    private readonly pindoService;
    private readonly sendgridService;
    private readonly configService;
    constructor(notificationRepo: Repository<Notification>, applicationRepo: Repository<Application>, categoryRepo: Repository<Category>, pindoService: PindoService, sendgridService: SendGridService, configService: ConfigService);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
}
