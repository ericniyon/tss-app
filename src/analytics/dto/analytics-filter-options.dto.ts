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
        // Handle all falsy values
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        
        // If it's already a Date, validate it
        if (value instanceof Date) {
            if (isNaN(value.getTime())) {
                return undefined; // Return undefined for invalid dates
            }
            return value;
        }
        
        // Convert to string and check if empty
        const strValue = String(value).trim();
        if (strValue === '' || strValue === 'undefined' || strValue === 'null' || strValue === 'NaN') {
            return undefined;
        }
        
        // Only parse if we have a valid string
        try {
            const parsed = parseDate(strValue);
            // Double check the parsed date is valid
            if (parsed && (parsed instanceof Date && isNaN(parsed.getTime()))) {
                return undefined;
            }
            return parsed;
        } catch (error) {
            // If parsing fails, return undefined instead of throwing
            return undefined;
        }
    })
    dateFrom?: Date | null;
    @OptionalProperty({
        default: new Date().toISOString().split('T')[0],
    })
    @Transform(({ value }: { value: any }) => {
        // Handle all falsy values
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        
        // If it's already a Date, validate it
        if (value instanceof Date) {
            if (isNaN(value.getTime())) {
                return undefined; // Return undefined for invalid dates
            }
            return value;
        }
        
        // Convert to string and check if empty
        const strValue = String(value).trim();
        if (strValue === '' || strValue === 'undefined' || strValue === 'null' || strValue === 'NaN') {
            return undefined;
        }
        
        // Only parse if we have a valid string
        try {
            const parsed = parseDate(strValue);
            // Double check the parsed date is valid
            if (parsed && (parsed instanceof Date && isNaN(parsed.getTime()))) {
                return undefined;
            }
            return parsed;
        } catch (error) {
            // If parsing fails, return undefined instead of throwing
            return undefined;
        }
    })
    dateTo?: Date | null;
}
