import { ApiProperty } from '@nestjs/swagger';
import { Section } from 'src/section/entities/section.entity';
import BaseEntity from 'src/shared/interfaces/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('subsections')
export class Subsection extends BaseEntity {
    @Column()
    @ApiProperty()
    name: string;

    @ManyToOne(() => Section)
    @ApiProperty()
    section: number;
}
