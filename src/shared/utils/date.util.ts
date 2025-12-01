import { BadRequestException } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';

export const parseDate = (d: string | undefined | null | any): Date | null => {
    // Handle undefined, null, or empty string
    if (!d || d === null || d === undefined) {
        return null;
    }
    
    // If it's already a Date, validate it
    if (d instanceof Date) {
        if (isNaN(d.getTime())) {
            throw new BadRequestException('Invalid date provided');
        }
        return d;
    }
    
    // Convert to string if it's not already
    const dateStr = String(d).trim();
    
    // Handle empty string after trimming
    if (dateStr === '' || dateStr === 'undefined' || dateStr === 'null') {
        return null;
    }
    
    // Validate date format
    if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(dateStr)) {
        throw new BadRequestException(
            'Date must be a date format (2020-01-01)',
        );
    }
    
    // Create date and validate it's not invalid
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        throw new BadRequestException(
            `Invalid date: ${dateStr}. Date must be a valid date format (2020-01-01)`,
        );
    }
    
    return date;
};

export const getActualDateRange = (
    startDate?: Date | null,
    endDate?: Date | null,
): { actualStartDate: Date | null; actualEndDate: Date } => {
    // Validate startDate if provided
    if (startDate) {
        if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
            throw new BadRequestException('Invalid startDate provided');
        }
    }
    
    // Validate endDate if provided
    if (endDate) {
        if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
            throw new BadRequestException('Invalid endDate provided');
        }
    }
    
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
