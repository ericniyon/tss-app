import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { EApplicationStatus } from '../enums';

export class UpdateApplicationStatusDto {
    @ApiProperty({ enum: EApplicationStatus })
    @IsEnum([
        EApplicationStatus.DENIED,
        EApplicationStatus.FIRST_STAGE_PASSED,
        EApplicationStatus.APPROVED,
    ])
    status: Exclude<
        EApplicationStatus,
        EApplicationStatus.SUBMITTED | EApplicationStatus.PENDING
    >;

    @ApiProperty()
    @ValidateIf((o) => o.status === EApplicationStatus.FIRST_STAGE_PASSED)
    @IsNumber()
    @IsNotEmpty()
    setupFee: number;

    @ApiProperty()
    @ValidateIf((o) => o.status === EApplicationStatus.FIRST_STAGE_PASSED)
    @IsNumber()
    @IsNotEmpty()
    subscriptionFee: number;
}
