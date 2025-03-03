import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ActivateDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    activated: boolean;
}
