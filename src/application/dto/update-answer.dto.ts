import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsNumber,
    IsOptional,
    IsPositive,
} from 'class-validator';

export class UpdateAnswerDto {
    @ApiProperty()
    @IsNumber()
    @IsPositive()
    id: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    attachments?: string[];

    @ApiPropertyOptional()
    @IsArray()
    @ArrayNotEmpty()
    responses?: string[];
}
