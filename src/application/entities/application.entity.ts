import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Certificate } from '../../certificate/entities/certificate.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import BaseEntity from '../../shared/interfaces/base.entity';
import { User } from '../../users/entities/user.entity';
import { EApplicationStatus, EPlatform } from '../enums';
import { Answer } from './answer.entity';

@Entity('applications')
export class Application extends BaseEntity {
    @Column()
    @ApiProperty()
    companyUrl: string;

    @Column({ default: EApplicationStatus.PENDING })
    @Transform(({ value }) =>
        (value === 'GRANTED' ? EApplicationStatus.APPROVED : value)?.replace(
            /_/g,
            ' ',
        ),
    )
    @ApiProperty()
    status: EApplicationStatus;

    @OneToMany(() => Answer, (answer) => answer.application)
    @ApiProperty()
    answers: Answer[];

    @ManyToOne(() => User)
    @ApiProperty()
    applicant: User;

    @ManyToMany(() => User)
    @JoinTable()
    assignees: User[];

    @ManyToOne(() => Category)
    @ApiProperty()
    category: Category;

    @Column({ default: false })
    @ApiProperty()
    completed: boolean;

    @Column({ nullable: true })
    @ApiProperty()
    businessPlatform: EPlatform;

    @Column({ nullable: true })
    @ApiProperty()
    setupFee: number;

    @Column({ nullable: true })
    @ApiProperty()
    subscriptionFee: number;

    @Column({ nullable: true })
    @ApiProperty()
    submittedAt: Date;

    @OneToOne(() => Certificate, (certificate) => certificate.application)
    @ApiProperty()
    certificate: Certificate;
}
