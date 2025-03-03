import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../application/entities/application.entity';
import { EApplicationStatus } from '../application/enums';
import { Category } from '../category/entities/category.entity';
import { NotificationEmailTemplate } from '../shared/templates/notification-email';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { ENotificationType } from './enums';
import { PindoService } from './pindo.service';
import { SendGridService } from './sendgrid.service';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,
        @InjectRepository(Application)
        private readonly applicationRepo: Repository<Application>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        private readonly pindoService: PindoService,
        private readonly sendgridService: SendGridService,
        private readonly configService: ConfigService,
    ) {}

    async create(
        createNotificationDto: CreateNotificationDto,
    ): Promise<Notification> {
        let category: Category;
        const queryBuilder =
            this.applicationRepo.createQueryBuilder('application');
        queryBuilder
            .leftJoin('application.category', 'category')
            .leftJoinAndSelect('application.applicant', 'applicant');

        if (!createNotificationDto.targetUsers) {
            if (
                createNotificationDto.targetApplicationStatus &&
                Object.values(EApplicationStatus).includes(
                    createNotificationDto.targetApplicationStatus,
                )
            ) {
                queryBuilder.andWhere('application.status = :status', {
                    status: createNotificationDto.targetApplicationStatus,
                });
            }
            if (createNotificationDto.targetCategory) {
                category = await this.categoryRepo.findOne(
                    createNotificationDto.targetCategory,
                );
                if (category) {
                    queryBuilder.andWhere('category.id = :categoryId', {
                        categoryId: category.id,
                    });
                }
            }
            if (createNotificationDto.targetPlatform) {
                queryBuilder.andWhere(
                    'application.businessPlatform = :platform',
                    {
                        platform: createNotificationDto.targetPlatform,
                    },
                );
            }
        } else {
            queryBuilder.andWhere('applicant.id = ANY(:userIds)', {
                userIds: [...createNotificationDto.targetUsers],
            });
        }

        const applications = await queryBuilder.getMany();
        if (!applications.length)
            throw new NotFoundException('There are no applicants to notify');
        if (createNotificationDto.type === ENotificationType.SMS) {
            // new Set() to remove duplicates
            const phones = [
                ...new Set(
                    applications
                        .map((a) => a.applicant?.phone)
                        .filter((a) => a),
                ),
            ];
            await Promise.all(
                phones.map((phone) =>
                    this.pindoService.send(
                        phone,
                        createNotificationDto.message,
                    ),
                ),
            );
        } else {
            // new Set() to remove duplicates
            const recipientEmails = [
                ...new Set(
                    applications.map((a) => a.applicant.email).filter((a) => a),
                ),
            ];
            await this.sendgridService.sendMultiple({
                to: recipientEmails,
                subject: `Trust seal system: ${
                    createNotificationDto.subject || 'Notification'
                }`,
                from: this.configService.get('sendgrid').fromEmail,
                html: NotificationEmailTemplate(createNotificationDto.message),
            });
        }
        const newNotification: Notification = {
            ...new Notification(),
            type: createNotificationDto.type,
            subject: createNotificationDto.subject,
            message: createNotificationDto.message,
            targetApplicationStatus:
                createNotificationDto.targetApplicationStatus,
            targetPlatform: createNotificationDto.targetPlatform,
            targetCategory: category,
        };
        newNotification.targetUsers = [];
        applications.forEach((a) => {
            if (
                !newNotification.targetUsers.find(
                    (u) => u.id === a.applicant.id,
                )
            )
                newNotification.targetUsers.push(a.applicant);
        });

        return await this.notificationRepo.save(newNotification);
    }
}
