import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import BaseEntity from '../../shared/interfaces/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
    @Column()
    @ApiProperty()
    name: string;

    @Column({ default: true, nullable: false })
    @ApiProperty()
    active: boolean;
}
