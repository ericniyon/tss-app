import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSubsectionDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Subsection title is required' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Subsection section is required' })
    section: number;
}
