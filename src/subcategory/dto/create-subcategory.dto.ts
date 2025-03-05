import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSubcategoryDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Subcategory name is required' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Subcategory category is required' })
    category: number;
}
