import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { EApplicationStatus, EPlatform } from '../../application/enums';
import { ENotificationType } from '../enums';

export class CreateNotificationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(ENotificationType)
    type: ENotificationType;

    @ApiProperty()
    @IsString()
    subject: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    targetUsers: number[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    targetCategory?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(EApplicationStatus)
    targetApplicationStatus?: EApplicationStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(EPlatform)
    targetPlatform: EPlatform;
}
