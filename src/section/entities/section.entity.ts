import { Category } from './../../category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import BaseEntity from '../../shared/interfaces/base.entity';

@Entity('sections')
export class Section extends BaseEntity {
    @Column()
    @ApiProperty()
    title: string;

    @Column({ type: 'text' })
    @ApiProperty()
    tips: string;

    @Column({ default: true })
    @ApiProperty()
    active: boolean;

    @Column({ default: false })
    @ApiProperty()
    readonly: boolean;

    @OneToMany(() => Question, (question) => question.section, { lazy: true })
    questions: Question[];

    @Column({ default: 1 })
    @ApiProperty()
    sectionCategory: number;

    @Column()
    @ApiProperty()
    subcategoryId: number;

    @Column({ nullable: true })
    @ApiProperty()
    isMandatory: boolean;
}
