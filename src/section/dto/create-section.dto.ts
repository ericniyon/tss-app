import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSectionDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Section title is required' })
    title: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'Section tips is required' })
    tips: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'Section category is required' })
    sectionCategory: number;
}
