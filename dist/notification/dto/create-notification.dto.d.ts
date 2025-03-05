import { EApplicationStatus, EPlatform } from '../../application/enums';
import { ENotificationType } from '../enums';
export declare class CreateNotificationDto {
    type: ENotificationType;
    subject: string;
    message: string;
    targetUsers: number[];
    targetCategory?: number;
    targetApplicationStatus?: EApplicationStatus;
    targetPlatform: EPlatform;
}
