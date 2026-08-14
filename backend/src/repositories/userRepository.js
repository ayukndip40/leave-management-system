const pool = require("../config/db");

const findByUuid = async (userUuid) => {

    const [rows] = await pool.query(
        `
        SELECT
            u.*,
            d.department_name,
            ep.gender,
            ep.date_of_birth,
            ep.marital_status,
            ep.address,
            ep.city,
            ep.emergency_contact_name,
            ep.emergency_contact_phone,
            ep.employment_date,
            ep.employment_type,
            ep.position_id,
            p.position_name

        FROM users u

        INNER JOIN employee_profiles ep
            ON ep.user_id = u.id

        INNER JOIN departments d
            ON d.id = u.department_id

        INNER JOIN positions p
            ON p.id = ep.position_id

        WHERE u.user_uuid = ?

        LIMIT 1
        `,
        [userUuid]
    );

    return rows[0] || null;
};

const findByEmail = async (email) => {

    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    return rows[0] || null;
};

const findByEmployeeNumber = async (employeeNumber) => {

    const [rows] = await pool.query(
        "SELECT * FROM users WHERE employee_number = ? LIMIT 1",
        [employeeNumber]
    );

    return rows[0] || null;
};

const findById = async (id) => {

    const [rows] = await pool.query(
        "SELECT * FROM users WHERE id = ? LIMIT 1",
        [id]
    );

    return rows[0] || null;
};

const emailExists = async (email, excludeUserId = null) => {

    let sql = "SELECT id FROM users WHERE email = ?";
    const params = [email];

    if (excludeUserId) {
        sql += " AND id != ?";
        params.push(excludeUserId);
    }

    const [rows] = await pool.query(sql, params);

    return rows.length > 0;
};

const updateStatus = async (userId, status, connection = pool) => {
    const [result] = await connection.query(
        `
        UPDATE users
        SET
            status = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [status, userId]
    );

    return result;
};

const updatePassword = async (userId, hashedPassword, mustChangePassword, connection = pool) => {

    const [result] = await connection.query(
        `
        UPDATE users
        SET
            password = ?,
            must_change_password = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [
            hashedPassword,
            mustChangePassword,
            userId
        ]
    );

    return result;

};

const findCurrentUser = async (userId) => {

    const [rows] = await pool.query(
        `
        SELECT
            u.user_uuid,
            u.employee_number,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.role,
            u.status,
            u.must_change_password,

            d.department_name,

            ep.gender,
            ep.date_of_birth,
            ep.marital_status,
            ep.address,
            ep.city,
            ep.emergency_contact_name,
            ep.emergency_contact_phone,
            ep.employment_date,
            ep.employment_type,

            p.position_name

        FROM users u

        LEFT JOIN departments d
            ON d.id = u.department_id

        LEFT JOIN employee_profiles ep
            ON ep.user_id = u.id

        LEFT JOIN positions p
            ON p.id = ep.position_id

        WHERE u.id = ?

        LIMIT 1
        `,
        [userId]
    );

    return rows[0] || null;
};

const updateEmployeeProfile = async (
  userId,
  {
    marital_status,
    address,
    city,
    emergency_contact_name,
    emergency_contact_phone,
  }
) => {

  const [result] = await pool.query(
    `
    UPDATE employee_profiles

    SET
      marital_status = ?,
      address = ?,
      city = ?,
      emergency_contact_name = ?,
      emergency_contact_phone = ?

    WHERE user_id = ?
    `,
    [
      marital_status,
      address,
      city,
      emergency_contact_name,
      emergency_contact_phone,
      userId,
    ]
  );

  return result;
};

module.exports = {
    findByUuid,
    findById,
    findByEmail,
    findByEmployeeNumber,
    emailExists,
    updateStatus,
    updatePassword,
    findCurrentUser,
    updateEmployeeProfile
};