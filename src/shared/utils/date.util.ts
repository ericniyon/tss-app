import { BadRequestException } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';

export const parseDate = (d: string | undefined | null | any): Date | null => {
    // Handle undefined, null, or empty string
    if (!d || d === null || d === undefined) {
        return null;
    }
    
    // Convert to string if it's not already
    const dateStr = String(d).trim();
    
    // Handle empty string after trimming
    if (dateStr === '') {
        return null;
    }
    
    // Validate date format
    if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(dateStr)) {
        throw new BadRequestException(
            'Date must be a date format (2020-01-01)',
        );
    }
    
    return new Date(dateStr);
};

export const getActualDateRange = (
    startDate?: Date | null,
    endDate?: Date | null,
): { actualStartDate: Date | null; actualEndDate: Date } => {
    const actualStartDate = startDate ? startOfDay(startDate) : null;
    const actualEndDate = endDate ? endOfDay(endDate) : endOfDay(new Date());
    if (actualStartDate !== null && actualStartDate > actualEndDate) {
        throw new BadRequestException(
            'DateFrom should not be greater than dateTo',
        );
    }
    return {
        actualStartDate,
        actualEndDate,
    };
};
