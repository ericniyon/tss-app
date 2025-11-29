import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsNotEmpty,
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
    @Transform(({ value }) => {
        if (value === null || value === undefined) return value;
        const num = Number(value);
        return isNaN(num) ? value : num;
    })
    @Type(() => Number)
    @IsNotEmpty({ message: 'applicationId is required' })
    @IsNumber({}, { message: 'applicationId must be a number' })
    @IsPositive({ message: 'applicationId must be a positive number' })
    applicationId: number;

    @ApiProperty()
    @Transform(({ value }) => {
        if (value === null || value === undefined) return value;
        const num = Number(value);
        return isNaN(num) ? value : num;
    })
    @Type(() => Number)
    @IsNotEmpty({ message: 'questionId is required' })
    @IsNumber({}, { message: 'questionId must be a number' })
    @IsPositive({ message: 'questionId must be a positive number' })
    questionId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'questionText is required' })
    @IsString({ message: 'questionText must be a string' })
    questionText: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined) return [];
        return Array.isArray(value) ? value : [];
    })
    @IsArray({ message: 'attachments must be an array' })
    attachments?: string[];

    @ApiProperty()
    @IsNotEmpty({ message: 'responses is required' })
    @IsArray({ message: 'responses must be an array' })
    @ArrayNotEmpty({ message: 'responses should not be empty' })
    responses: string[];

    @ApiPropertyOptional({ enum: EAnswerStatus, nullable: true })
    @IsOptional()
    @IsEnum(EAnswerStatus, { message: 'status must be a valid EAnswerStatus enum value' })
    status?: EAnswerStatus | null;
}

export class CreateBulkStandaloneAnswersDto {
    @ApiProperty({ type: () => CreateStandaloneAnswerDto, isArray: true })
    @IsArray({ message: 'answers must be an array' })
    @ArrayNotEmpty({ message: 'answers should not be empty' })
    @ValidateNested({ each: true })
    @Type(() => CreateStandaloneAnswerDto)
    answers: CreateStandaloneAnswerDto[];
}
