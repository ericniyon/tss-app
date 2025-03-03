import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Answer } from '../entities/answer.entity';
import { EApplicationStatus } from '../enums';

export class ApplicationResponseDto {
    @ApiProperty()
    companyUrl: string;

    @ApiProperty()
    feedback: string;

    @ApiProperty()
    status: EApplicationStatus;

    @ApiProperty()
    applicant: User;

    @ApiProperty()
    assignees: User[];

    @ApiProperty()
    category: Category;

    @ApiProperty()
    completed: boolean;

    @ApiProperty()
    submittedAt: Date;

    @ApiProperty()
    sections: { title: string; tips: string; answers: Answer[] }[];
}
