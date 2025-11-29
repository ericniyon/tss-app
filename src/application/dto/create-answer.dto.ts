import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from 'class-validator';
import { EAnswerStatus } from '../enums';

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

export class CreateStandaloneAnswerDto {
    @ApiProperty()
    @IsNumber()
    @IsPositive()
    applicationId: number;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    questionId: number;

    @ApiProperty()
    @IsString()
    questionText: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    attachments?: string[];

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    responses: string[];

    @ApiPropertyOptional({ enum: EAnswerStatus, nullable: true })
    @IsOptional()
    @IsEnum(EAnswerStatus)
    status?: EAnswerStatus | null;
}
