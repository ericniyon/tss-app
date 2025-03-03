import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { OptionalProperty } from '../../shared/decorators';
import { CreateOrUpdateAnswersDto } from './create-answer.dto';

export class CreateApplicationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    companyUrl: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    categoryId: number;

    @OptionalProperty()
    answers: CreateOrUpdateAnswersDto;
}
