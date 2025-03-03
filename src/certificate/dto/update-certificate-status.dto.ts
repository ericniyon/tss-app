import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';
import { ECertificateStatus } from '../enums';

export class UpdateCertificateStatusDto {
    @ApiProperty({ enum: ECertificateStatus })
    @IsEnum(ECertificateStatus)
    status: ECertificateStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    certificates?: number[];
}
