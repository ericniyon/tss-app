import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { EAnswerStatus } from '../enums';
import { Application } from './application.entity';

@Entity('answers')
export class Answer extends BaseEntity {
    @Column()
    @ApiProperty()
    questionText: string;

    @Column('text', { array: true, default: [] })
    @ApiProperty()
    attachments: string[];

    @Column('text', { array: true, default: [] })
    @ApiProperty()
    responses: string[];

    @ApiProperty()
    @Column({ nullable: true })
    @Transform(({ value }) => value?.replaceAll('_', ' '))
    status: EAnswerStatus;

    @Column('text', { nullable: true })
    @ApiProperty()
    feedback: string;

    @ManyToOne(() => Application, (application) => application.answers)
    @ApiProperty({ type: () => Application })
    application: Application;

    @ManyToOne(() => Question)
    @ApiProperty({ type: () => Question })
    question: Question;
}
