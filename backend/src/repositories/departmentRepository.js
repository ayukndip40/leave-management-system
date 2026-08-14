const pool = require("../config/db");

const getAllDepartments = async () => {
    const [rows] = await pool.query(
        `
        SELECT
            id,
            department_name,
            department_code,
            description,
            status,
            created_at
        FROM departments
        WHERE status = 'active'
        ORDER BY department_name ASC
        `
    );

    return rows;
};

module.exports = {
    getAllDepartments,
};