declare class StatusPercentage {
    pending: number;
    firstStagePassed: number;
    approved: number;
    denied: number;
}
declare class CategoryPercentage {
    name: string;
    percentage: number;
}
declare class PaymentByDate {
    date: string;
    expected: number;
    actual: number;
}
declare class RateByDate {
    date: string;
    all: number;
    accepted: number;
    denied: number;
}
export declare class ApplicationAnalyticsDto {
    total: number;
    totalApproved: number;
    totalPending: number;
    expectedIncome: number;
    actualIncome: number;
    categoryPercentages: CategoryPercentage[];
    statusPercentages: StatusPercentage;
    paymentsByDate: PaymentByDate[];
    ratesByDate: RateByDate[];
}
export declare class ApplicationRowDto {
    companyName: string;
    email: string;
    phone: string;
    category: string;
    status: string;
    appliedDate: string;
}
export declare class CategoryRowDto {
    name: string;
    percentage: number;
}
export {};
