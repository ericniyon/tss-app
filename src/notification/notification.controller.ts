import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreatedResponse } from '../shared/decorators';
import { Roles } from '../shared/enums/roles.enum';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';

@Controller('notifications')
@Auth(Roles.DBI_ADMIN, Roles.DBI_EXPERT)
@ApiTags('Notifications')
@ApiExtraModels(Notification)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}
    @Post()
    @CreatedResponse(Notification)
    async create(
        @Body() createNotificationDto: CreateNotificationDto,
    ): Promise<GenericResponse<Notification>> {
        return {
            message: 'Notification created successfully',
            results: await this.notificationService.create(
                createNotificationDto,
            ),
        };
    }
}
