const pool = require("../config/db");

const getAllPositions = async () => {
    const [rows] = await pool.query(
        `
        SELECT
            p.id,
            p.position_name,
            p.position_code,
            p.department_id,
            d.department_name,
            p.description,
            p.status,
            p.created_at
        FROM positions p
        INNER JOIN departments d
            ON p.department_id = d.id
        WHERE p.status = 'active'
        ORDER BY d.department_name ASC,
                 p.position_name ASC
        `
    );

    return rows;
};

module.exports = {
    getAllPositions,
};