declare class statusPercentages {
    granted: number;
    pendingPayment: number;
    expired: number;
    revoked: number;
}
declare class PaymentByDate {
    date: string;
    expected: number;
    actual: number;
}
declare class CategoryPercentage {
    name: string;
    percentage: number;
}
declare class RateByDate {
    date: string;
    all: number;
    granted: number;
    revoked: number;
}
export declare class CertificateAnalyticsDto {
    total: number;
    totalGranted: number;
    totalPending: number;
    expectedIncome: number;
    actualIncome: number;
    categoryPercentages: CategoryPercentage[];
    certificateStatus: statusPercentages;
    paymentsByDate: PaymentByDate[];
    ratesByDate: RateByDate[];
}
export declare class CertificateRowDto {
    companyName: string;
    email: string;
    phone: string;
    category: string;
    status: string;
    issueDate: string;
}
export {};
