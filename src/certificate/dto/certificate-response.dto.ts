import { ApiProperty } from '@nestjs/swagger';
import { Application } from '../../application/entities/application.entity';
import { ECertificateStatus } from '../enums';

export class CertificateResponseDto {
    @ApiProperty()
    uniqueId: string;

    @ApiProperty()
    status: ECertificateStatus;

    @ApiProperty()
    application: Application;

    @ApiProperty()
    expirationDate: Date;

    @ApiProperty()
    isValid: boolean;
}
