import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

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

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsBoolean()
    isMandatory?: boolean;
}
