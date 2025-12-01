import { BadRequestException } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';

export const parseDate = (d: string | undefined | null): Date | null => {
    // Handle undefined, null, or empty string
    if (!d || d === '' || d.trim() === '') {
        return null;
    }
    
    // Validate date format
    if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(d)) {
        throw new BadRequestException(
            'Date must be a date format (2020-01-01)',
        );
    }
    
    return new Date(d);
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
