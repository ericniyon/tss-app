import { EApplicationStatus, EPlatform } from '../../application/enums';
import { Category } from '../../category/entities/category.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { User } from '../../users/entities/user.entity';
import { ENotificationType } from '../enums';
export declare class Notification extends BaseEntity {
    type: ENotificationType;
    subject: string;
    message: string;
    targetCategory: Category;
    targetApplicationStatus: EApplicationStatus;
    targetPlatform: EPlatform;
    targetUsers: User[];
}
