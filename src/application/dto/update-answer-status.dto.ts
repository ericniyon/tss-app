import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsNumber,
    IsPositive,
    IsString,
    ValidateNested,
} from 'class-validator';
import { OptionalProperty } from '../../shared/decorators';
import { EAnswerStatus } from '../enums';

export class UpdateAnswerStatusDto {
    @OptionalProperty()
    @IsNumber()
    @IsPositive()
    id: number;

    @ApiProperty({ enum: EAnswerStatus })
    @IsEnum(EAnswerStatus)
    status: EAnswerStatus;

    @OptionalProperty()
    @IsString()
    feedback: string;
}

export class ReviewAnswersDto {
    @ApiProperty({ isArray: true, type: () => UpdateAnswerStatusDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateAnswerStatusDto)
    answers: UpdateAnswerStatusDto[];
}
