import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class AddAssigneesDto {
    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    assigneeIds: number[];
}
