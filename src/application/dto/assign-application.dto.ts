import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class AssignApplicationDto {
    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    assignees: number[];
}
