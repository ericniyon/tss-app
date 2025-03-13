import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Section } from '../../section/entities/section.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { EType } from '../enums';
import { Subsection } from 'src/subsection/entities/subsection.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';

@Entity('questions')
export class Question extends BaseEntity {
    @Column()
    @ApiProperty()
    text: string;

    @Column()
    @ApiProperty()
    type: EType;

    @Column({ default: false })
    @ApiProperty()
    requiresAttachments: boolean;

    @Column({ default: true })
    @ApiProperty()
    active: boolean;

    @Column('text', { array: true, nullable: true })
    @ApiProperty()
    possibleAnswers: string[];

    @Column({ default: false })
    @ApiProperty()
    hasBeenAsked: boolean;

    @ManyToOne(() => Section)
    @ApiProperty({ type: Section })
    section: Section;

    @ManyToMany(() => Category)
    @JoinTable({ name: 'questions_categories' })
    categories: Category[];

    @ManyToOne(() => Subsection)
    @ApiProperty({ type: Subsection })
    @Column({ nullable: true, default: null })
    subsection: number;

    @ManyToOne(() => Subcategory)
    @ApiProperty({ type: Subcategory })
    @Column({ nullable: true, default: null })
    subcategory: number;
    answers: any;
}
