const getDayLeft = (expireDate: string) => {
    const dt = new Date(expireDate);
    dt.setDate(dt.getDate() - 1);
    return formatDate(dt);
};

const getTwoWeeksLeft = (expireDate: string) => {
    const dt = new Date(expireDate);
    dt.setDate(dt.getDate() - 14);
    return formatDate(dt);
};

const getMonthLeft = (expireDate: string) => {
    const dt = new Date(expireDate);
    dt.setMonth(dt.getMonth() - 1);
    return formatDate(dt);
};

const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
};

export const compareDate = (expirationDate) => {
    const dt = formatDate(expirationDate);
    const currDate = new Date().toISOString().split('T')[0];
    let isTrue: boolean;
    if (currDate === getMonthLeft(dt)) {
        isTrue = true;
    } else if (currDate === getTwoWeeksLeft(dt)) {
        isTrue = true;
    } else if (currDate === getDayLeft(dt)) {
        isTrue = true;
    } else {
        isTrue = false;
    }
    return isTrue;
};
