import { Transform } from 'class-transformer';
import { IsArray } from 'class-validator';
import { OptionalProperty } from '../../shared/decorators';
import { CommonFilterOptionsDto } from '../../shared/dto/common-filter-options.dto';
import { EApplicationStatus } from '../enums';

export class ApplicationFilterOptionsDto extends CommonFilterOptionsDto {
    @OptionalProperty({ enum: EApplicationStatus })
    status?: EApplicationStatus;
    @OptionalProperty({ example: '1,2' })
    @Transform(({ value }: { value: string }) =>
        value === '' ? null : value?.split(','),
    )
    @IsArray()
    categories?: string;
    @OptionalProperty()
    assignee?: number;
}
