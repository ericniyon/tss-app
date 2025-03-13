import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from '../../shared/interfaces/base.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity('subcategories')
export class Subcategory extends BaseEntity {
    @Column()
    @ApiProperty()
    name: string;

    @ManyToOne(() => Category)
    @ApiProperty()
    category: Category;
}
