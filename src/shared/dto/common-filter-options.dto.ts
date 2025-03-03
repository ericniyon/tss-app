import { Transform } from 'class-transformer';
import { OptionalProperty } from '../decorators';
import { ESort } from '../enums';
import { parseDate } from '../utils/date.util';

export class CommonFilterOptionsDto {
    @OptionalProperty({
        example: new Date(new Date().setDate(new Date().getDate() - 7))
            .toISOString()
            .split('T')[0],
    })
    @Transform(({ value }: { value: string }) => parseDate(value))
    dateFrom?: Date;
    @OptionalProperty({
        default: new Date().toISOString().split('T')[0],
    })
    @Transform(({ value }: { value: string }) => parseDate(value))
    dateTo?: Date;
    @OptionalProperty()
    search?: string;
    @OptionalProperty({ enum: ESort })
    sort?: ESort;
}
