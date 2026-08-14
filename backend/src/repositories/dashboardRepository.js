const pool = require("../config/db");

const getDashboardStatistics = async () => {
  const [[employees]] = await pool.query(`
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'employee'
  `);

  const [[departments]] = await pool.query(`
    SELECT COUNT(*) AS total
    FROM departments
  `);

  const [[leaveTypes]] = await pool.query(`
    SELECT COUNT(*) AS total
    FROM leave_types
    WHERE status = 'Active'
  `);

  const [[hrUsers]] = await pool.query(`
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'hr'
  `);

  return {
    employees: Number(employees.total),
    departments: Number(departments.total),
    leaveTypes: Number(leaveTypes.total),
    hrUsers: Number(hrUsers.total),
  };
};

module.exports = {
  getDashboardStatistics,
};