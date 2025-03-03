import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { EApplicationStatus, EPlatform } from '../../application/enums';
import { Category } from '../../category/entities/category.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { User } from '../../users/entities/user.entity';
import { ENotificationType } from '../enums';

@Entity('notifications')
export class Notification extends BaseEntity {
    @Column()
    @ApiProperty()
    type: ENotificationType;

    @Column()
    @ApiProperty()
    subject: string;

    @Column('text')
    @ApiProperty()
    message: string;

    @ManyToOne(() => Category)
    @ApiProperty()
    targetCategory: Category;

    @Column({ nullable: true })
    @ApiProperty()
    targetApplicationStatus: EApplicationStatus;

    @Column({ nullable: true })
    @ApiProperty()
    targetPlatform: EPlatform;

    @ManyToMany(() => User, (user) => user.notifications)
    @JoinTable()
    @ApiProperty()
    targetUsers: User[];
}
