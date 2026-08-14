const publicHolidayRepository = require("../repositories/publicHolidayRepository");

const calculateWorkingDays = async (startDate, endDate) => {

    const holidays =
        await publicHolidayRepository.getPublicHolidaysBetweenDates(
            startDate,
            endDate
        );

    const holidaySet = new Set(
        holidays.map(h =>
            h.holiday_date.toISOString().split("T")[0]
        )
    );

    let totalDays = 0;

    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {

        const day = current.getDay();

        const currentDate =
            current.toISOString().split("T")[0];

        const isWeekend =
            day === 0 || day === 6;

        const isHoliday =
            holidaySet.has(currentDate);

        if (!isWeekend && !isHoliday) {
            totalDays++;
        }

        current.setDate(current.getDate() + 1);

    }

    return totalDays;

};

module.exports = {
    calculateWorkingDays
};