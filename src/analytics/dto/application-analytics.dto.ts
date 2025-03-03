import { ApiProperty } from '@nestjs/swagger';

class StatusPercentage {
    @ApiProperty()
    pending: number;
    @ApiProperty()
    firstStagePassed: number;
    @ApiProperty()
    approved: number;
    @ApiProperty()
    denied: number;
}
class CategoryPercentage {
    @ApiProperty()
    name: string;
    @ApiProperty()
    percentage: number;
}
class PaymentByDate {
    @ApiProperty()
    date: string;
    @ApiProperty()
    expected: number;
    @ApiProperty()
    actual: number;
}
class RateByDate {
    @ApiProperty()
    date: string;
    @ApiProperty()
    all: number;
    @ApiProperty()
    accepted: number;
    @ApiProperty()
    denied: number;
}
export class ApplicationAnalyticsDto {
    @ApiProperty()
    total: number;
    @ApiProperty()
    totalApproved: number;
    @ApiProperty()
    totalPending: number;
    @ApiProperty()
    expectedIncome: number;
    @ApiProperty()
    actualIncome: number;
    @ApiProperty({ isArray: true, type: CategoryPercentage })
    categoryPercentages: CategoryPercentage[] = [];
    @ApiProperty()
    statusPercentages: StatusPercentage;
    @ApiProperty({ isArray: true, type: PaymentByDate })
    paymentsByDate: PaymentByDate[] = [];
    @ApiProperty({ isArray: true, type: RateByDate })
    ratesByDate: RateByDate[] = [];
}

export class ApplicationRowDto {
    companyName: string;
    email: string;
    phone: string;
    category: string;
    status: string;
    appliedDate: string;
}

export class CategoryRowDto {
    name: string;
    percentage: number;
}
