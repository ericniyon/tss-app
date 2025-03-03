import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { Certificate } from '../entities/certificate.entity';

export class EmailDto {
    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    certificates: Certificate[];

    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty()
    @IsString()
    subject: string;
}
