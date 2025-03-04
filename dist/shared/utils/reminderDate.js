"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDate = void 0;
const getDayLeft = (expireDate) => {
    const dt = new Date(expireDate);
    dt.setDate(dt.getDate() - 1);
    return formatDate(dt);
};
const getTwoWeeksLeft = (expireDate) => {
    const dt = new Date(expireDate);
    dt.setDate(dt.getDate() - 14);
    return formatDate(dt);
};
const getMonthLeft = (expireDate) => {
    const dt = new Date(expireDate);
    dt.setMonth(dt.getMonth() - 1);
    return formatDate(dt);
};
const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};
const compareDate = (expirationDate) => {
    const dt = formatDate(expirationDate);
    const currDate = new Date().toISOString().split('T')[0];
    let isTrue;
    if (currDate === getMonthLeft(dt)) {
        isTrue = true;
    }
    else if (currDate === getTwoWeeksLeft(dt)) {
        isTrue = true;
    }
    else if (currDate === getDayLeft(dt)) {
        isTrue = true;
    }
    else {
        isTrue = false;
    }
    return isTrue;
};
exports.compareDate = compareDate;
//# sourceMappingURL=reminderDate.js.map