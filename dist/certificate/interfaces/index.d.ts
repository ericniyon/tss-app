import { ECertificateStatus } from '../enums';
export interface AFilterOptions {
    status?: ECertificateStatus;
    dateFrom?: Date;
    dateTo?: Date;
    categories?: number[];
    assignee?: number;
    search?: string;
}
export interface EmailBody {
    message: string;
    subject: string;
}
