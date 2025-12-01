import { Transform } from 'class-transformer';
import { OptionalProperty } from '../../shared/decorators';
import { parseDate } from '../../shared/utils/date.util';

export class AnalyticsFilterOptionsDto {
    @OptionalProperty({
        example: new Date(new Date().setDate(new Date().getDate() - 7))
            .toISOString()
            .split('T')[0],
    })
    @Transform(({ value }: { value: string | undefined }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        return parseDate(value);
    })
    dateFrom?: Date | null;
    @OptionalProperty({
        default: new Date().toISOString().split('T')[0],
    })
    @Transform(({ value }: { value: string | undefined }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        return parseDate(value);
    })
    dateTo?: Date | null;
}
