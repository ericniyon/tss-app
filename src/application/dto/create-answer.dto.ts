import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsNumber,
    IsOptional,
    IsPositive,
    ValidateNested,
} from 'class-validator';

export class CreateAnswerDto {
    @ApiProperty()
    @IsNumber()
    questionId: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    attachments?: string[];

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    responses: string[];
}

export class CreateOrUpdateAnswersDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @IsPositive()
    sectionId: number;

    @ApiProperty({ type: () => CreateAnswerDto, isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    answers: CreateAnswerDto[];
}
