import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';
import { EType } from '../enums';

export class CreateQuestionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(EType)
    type: EType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    requiresAttachments: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @ArrayNotEmpty()
    @IsArray()
    possibleAnswers: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @IsPositive()
    sectionId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    categoryIds: number[];

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    subsectionId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    subcategoryId: number;
}
