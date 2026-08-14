const pool = require("../config/db");

const generateEmployeeNumber = async () => {
    const [rows] = await pool.query(`
        SELECT employee_number
        FROM users
        ORDER BY id DESC
        LIMIT 1
    `);

    if (rows.length === 0) {
        return "EMP0001";
    }

    const lastNumber = parseInt(
        rows[0].employee_number.replace("EMP", ""),
        10
    );

    const nextNumber = lastNumber + 1;

    return `EMP${String(nextNumber).padStart(4, "0")}`;
};

module.exports = generateEmployeeNumber;