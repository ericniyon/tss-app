import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';
import { Certificate } from '../../certificate/entities/certificate.entity';
import { EType } from '../../question/enums';
import { EApplicationStatus, EAnswerStatus } from '../enums';
import { User } from '../../users/entities/user.entity';

class ApplicationEditAnswerDto {
    @ApiProperty()
    id: number;

    @ApiProperty({ type: [String] })
    responses: string[];

    @ApiProperty({ type: [String] })
    attachments: string[];

    @ApiProperty({ enum: EAnswerStatus, required: false })
    status?: EAnswerStatus;

    @ApiProperty({ required: false })
    feedback?: string;
}

class ApplicationEditQuestionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    text: string;

    @ApiProperty({ enum: EType })
    type: EType;

    @ApiProperty()
    requiresAttachments: boolean;

    @ApiProperty({ type: [String], required: false })
    possibleAnswers?: string[];

    @ApiProperty({ type: () => ApplicationEditAnswerDto, required: false })
    answer?: ApplicationEditAnswerDto;
}

class ApplicationEditSectionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty({ required: false })
    tips?: string;

    @ApiProperty({ type: () => ApplicationEditQuestionDto, isArray: true })
    questions: ApplicationEditQuestionDto[];
}

export class ApplicationEditResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    companyUrl: string;

    @ApiProperty({ enum: EApplicationStatus })
    status: EApplicationStatus;

    @ApiProperty()
    completed: boolean;

    @ApiProperty({ required: false })
    submittedAt?: Date;

    @ApiProperty({ required: false })
    setupFee?: number;

    @ApiProperty({ required: false })
    subscriptionFee?: number;

    @ApiProperty({ required: false })
    businessPlatform?: string;

    @ApiProperty({ type: () => Category })
    category: Category;

    @ApiProperty({ type: () => User })
    applicant: User;

    @ApiProperty({ type: () => User, isArray: true })
    assignees: User[];

    @ApiProperty({ type: () => Certificate, required: false })
    certificate?: Certificate;

    @ApiProperty({ type: () => ApplicationEditSectionDto, isArray: true })
    sections: ApplicationEditSectionDto[];
}


