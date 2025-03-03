import { ApiProperty } from '@nestjs/swagger';

class statusPercentages {
    @ApiProperty()
    granted: number;
    @ApiProperty()
    pendingPayment: number;
    @ApiProperty()
    expired: number;
    @ApiProperty()
    revoked: number;
}

class PaymentByDate {
    @ApiProperty()
    date: string;
    @ApiProperty()
    expected: number;
    @ApiProperty()
    actual: number;
}
class CategoryPercentage {
    @ApiProperty()
    name: string;
    @ApiProperty()
    percentage: number;
}
class RateByDate {
    @ApiProperty()
    date: string;
    @ApiProperty()
    all: number;
    @ApiProperty()
    granted: number;
    @ApiProperty()
    revoked: number;
}

export class CertificateAnalyticsDto {
    @ApiProperty()
    total: number;
    @ApiProperty()
    totalGranted: number;
    @ApiProperty()
    totalPending: number;
    @ApiProperty()
    expectedIncome: number;
    @ApiProperty()
    actualIncome: number;
    @ApiProperty({ isArray: true, type: CategoryPercentage })
    categoryPercentages: CategoryPercentage[] = [];
    certificateStatus: statusPercentages;
    @ApiProperty({ isArray: true, type: PaymentByDate })
    paymentsByDate: PaymentByDate[] = [];
    @ApiProperty({ isArray: true, type: RateByDate })
    ratesByDate: RateByDate[] = [];
}

export class CertificateRowDto {
    companyName: string;
    email: string;
    phone: string;
    category: string;
    status: string;
    issueDate: string;
}
