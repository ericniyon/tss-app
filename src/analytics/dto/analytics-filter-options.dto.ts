import { Transform } from 'class-transformer';
import { OptionalProperty } from '../../shared/decorators';
import { parseDate } from '../../shared/utils/date.util';

export class AnalyticsFilterOptionsDto {
    @OptionalProperty({
        example: new Date(new Date().setDate(new Date().getDate() - 7))
            .toISOString()
            .split('T')[0],
    })
    @Transform(({ value }: { value: any }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        // If it's already a Date, return it
        if (value instanceof Date) {
            return value;
        }
        // Convert to string and check if empty
        const strValue = String(value).trim();
        if (strValue === '') {
            return undefined;
        }
        return parseDate(strValue);
    })
    dateFrom?: Date | null;
    @OptionalProperty({
        default: new Date().toISOString().split('T')[0],
    })
    @Transform(({ value }: { value: any }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        // If it's already a Date, return it
        if (value instanceof Date) {
            return value;
        }
        // Convert to string and check if empty
        const strValue = String(value).trim();
        if (strValue === '') {
            return undefined;
        }
        return parseDate(strValue);
    })
    dateTo?: Date | null;
}
