const pool = require("../config/db");

const getPublicHolidaysBetweenDates = async (startDate, endDate) => {

    const [rows] = await pool.query(
        `
        SELECT holiday_date
        FROM public_holidays
        WHERE holiday_date BETWEEN ? AND ?
        `,
        [startDate, endDate]
    );

    return rows;
};

module.exports = {
    getPublicHolidaysBetweenDates
};