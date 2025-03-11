import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from '../../shared/interfaces/base.entity';
import { Category } from '../../category/entities/category.entity';

@Entity('subcategories')
export class Subcategory extends BaseEntity {
    @Column()
    @ApiProperty()
    name: string;

    @Column({ default: true, nullable: false })
    @ApiProperty()
    active: boolean;

    @ManyToOne(() => Category)
    @ApiProperty()
    category: Category;
}
