import { Transform } from 'class-transformer';
import { IsArray } from 'class-validator';
import { OptionalProperty } from '../../shared/decorators';
import { CommonFilterOptionsDto } from '../../shared/dto/common-filter-options.dto';
import { EStatus, EType } from '../enums';

export class QuestionFilterOptionsDto extends CommonFilterOptionsDto {
    @OptionalProperty({ enum: EStatus })
    status?: EStatus;
    @OptionalProperty({ example: '1,2' })
    @Transform(({ value }: { value: string }) =>
        value === '' ? null : value?.split(','),
    )
    @IsArray()
    categories?: string;
    @OptionalProperty()
    section?: number;
    @OptionalProperty({ enum: EType })
    type?: EType;
}
