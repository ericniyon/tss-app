"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActualDateRange = exports.parseDate = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const parseDate = (d) => {
    if (d !== '' && !/^(\d{4})-(\d{2})-(\d{2})$/.test(d))
        throw new common_1.BadRequestException('Date must be a date format (2020-01-01)');
    return d === '' ? null : new Date(d);
};
exports.parseDate = parseDate;
const getActualDateRange = (startDate, endDate) => {
    const actualStartDate = startDate ? (0, date_fns_1.startOfDay)(startDate) : null;
    const actualEndDate = endDate ? (0, date_fns_1.endOfDay)(endDate) : (0, date_fns_1.endOfDay)(new Date());
    if (actualStartDate !== null && actualStartDate > actualEndDate) {
        throw new common_1.BadRequestException('DateFrom should not be greater than dateTo');
    }
    return {
        actualStartDate,
        actualEndDate,
    };
};
exports.getActualDateRange = getActualDateRange;
//# sourceMappingURL=date.util.js.map