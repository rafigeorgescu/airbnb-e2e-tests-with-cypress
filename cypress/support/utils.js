import dayjs from "dayjs";

export const getFutureDate = (amount, unit, from = dayjs()) => {
    return dayjs(from).add(amount, unit);
};

export const getDateInformation = (date, format = "D-MMMM-YYYY") => {
    const [day, month, year] = dayjs(date).format(format).split("-");
    return { day, month, year };
};

export const calculatePeriod = (fromDate, toDate) => {
    const { day: fromDay, month: fromMonth, year: fromYear } = getDateInformation(fromDate, "D-MMM-YYYY");
    const { day: toDay, month: toMonth, year: toYear } = getDateInformation(toDate, "D-MMM-YYYY");

    if (fromYear !== toYear) {
        return `${fromMonth} ${fromDay}, ${fromYear} – ${toMonth} ${toDay}, ${toYear}`;
    } else if (fromMonth !== toMonth) {
        return dayjs().year().toString() === fromYear
            ? `${fromMonth} ${fromDay} – ${toMonth} ${toDay}`
            : `${fromMonth} ${fromDay} – ${toMonth} ${toDay}, ${toYear}`;
    } else {
        return dayjs().year().toString() === fromYear ? `${fromMonth} ${fromDay} – ${toDay}` : `${fromMonth} ${fromDay} – ${toDay}, ${toYear}`;
    }
};
