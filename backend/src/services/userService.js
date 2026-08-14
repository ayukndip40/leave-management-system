const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const userRepository = require("../repositories/userRepository");
const generateEmployeeNumber = require("../utils/employeeNumberGenerator");
const generatePassword = require("../utils/passwordGenerator");
const leaveBalanceRepository = require("../repositories/leaveBalanceRepository");

const createUser = async (userData) => {
    const connection = await pool.getConnection();

    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            role,
            department_id,

            gender,
            date_of_birth,
            marital_status,
            address,
            city,
            emergency_contact_name,
            emergency_contact_phone,
            employment_date,
            employment_type,
            position_id
        } = userData;

        // Check if email already exists
        const [existingUser] = await connection.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            throw new Error("Email already exists.");
        }

        // Generate employee details
        const employeeNumber = await generateEmployeeNumber();
        const temporaryPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
        const userUuid = uuidv4();

        await connection.beginTransaction();

        // Insert into users
        const [userResult] = await connection.query(
            `INSERT INTO users
            (
                user_uuid,
                employee_number,
                first_name,
                last_name,
                email,
                phone,
                password,
                role,
                department_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userUuid,
                employeeNumber,
                first_name,
                last_name,
                email,
                phone,
                hashedPassword,
                role,
                department_id
            ]
        );

        // Insert into employee_profiles
        await connection.query(
            `INSERT INTO employee_profiles
            (
                user_id,
                gender,
                date_of_birth,
                marital_status,
                address,
                city,
                emergency_contact_name,
                emergency_contact_phone,
                employment_date,
                employment_type,
                position_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userResult.insertId,
                gender,
                date_of_birth,
                marital_status,
                address,
                city,
                emergency_contact_name,
                emergency_contact_phone,
                employment_date,
                employment_type,
                position_id
            ]
        );

                // ===========================================
                // Initialize Employee Leave Balances
                // ===========================================

        await leaveBalanceRepository.initializeEmployeeLeaveBalances(
            userResult.insertId,
            new Date().getFullYear(),
            connection
        );

        await connection.commit();

        return {
            success: true,
            message: "Employee created successfully.",
            employee_number: employeeNumber,
            temporary_password: temporaryPassword
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};

const getAllUsers = async (query) => {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = query.search || "";
    const role = query.role || "";
    const status = query.status || "";
    const department = query.department || "";

    let sql = `
        SELECT
            u.user_uuid,
            u.employee_number,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.role,
            u.status,

            d.department_name,

            p.position_name,

            ep.employment_type,
            ep.employment_date

        FROM users u

        INNER JOIN employee_profiles ep
            ON ep.user_id = u.id

        INNER JOIN departments d
            ON d.id = u.department_id

        INNER JOIN positions p
            ON p.id = ep.position_id

        WHERE 1=1
    `;

    const params = [];
        if (search) {

        sql += `
        AND
        (
            u.first_name LIKE ?
            OR
            u.last_name LIKE ?
            OR
            u.employee_number LIKE ?
            OR
            u.email LIKE ?
        )
        `;

        params.push(
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
            `%${search}%`
        );

    }
        if (role) {

        sql += " AND u.role = ? ";

        params.push(role);

    }
        if (department) {

        sql += " AND d.id = ? ";

        params.push(department);

    }
        sql += `
        ORDER BY u.first_name ASC
        LIMIT ?
        OFFSET ?
    `;

    params.push(limit, offset);

    const [users] = await pool.query(sql, params);
        let countSql = `
        SELECT COUNT(*) AS total

        FROM users u

        INNER JOIN employee_profiles ep
            ON ep.user_id = u.id

        INNER JOIN departments d
            ON d.id = u.department_id

        INNER JOIN positions p
            ON p.id = ep.position_id

        WHERE 1=1
    `;

    const countParams = [];

    if (search) {

        countSql += `
        AND
        (
            u.first_name LIKE ?
            OR
            u.last_name LIKE ?
            OR
            u.employee_number LIKE ?
            OR
            u.email LIKE ?
        )
        `;

        countParams.push(
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
            `%${search}%`
        );

    }

    if (role) {
        countSql += " AND u.role = ?";
        countParams.push(role);
    }

    if (status) {
        countSql += " AND u.status = ?";
        countParams.push(status);
    }

    if (department) {
        countSql += " AND d.id = ?";
        countParams.push(department);
    }

    const [[count]] = await pool.query(
        countSql,
        countParams
    );
        return {

        success: true,

        data: users,

        pagination: {

            page,

            limit,

            totalRecords: count.total,

            totalPages: Math.ceil(
                count.total / limit
            )

        }

    };

};

const getUserByUuid = async (userUuid) => {

    const [users] = await pool.query(
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

    if (users.length === 0) {
        throw new Error("User not found.");
    }

    return {
        success: true,
        data: users[0]
    };
};

const updateUser = async (userUuid, userData) => {

    const user = await userRepository.findByUuid(userUuid);

    if (!user) {
        throw new Error("User not found.");
    }

    const emailTaken = await userRepository.emailExists(
        userData.email,
        user.id
    );

    if (emailTaken) {
        throw new Error("Email already exists.");
    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        await connection.query(
            `
            UPDATE users
            SET
                first_name=?,
                last_name=?,
                email=?,
                phone=?,
                role=?,
                department_id=?,
                updated_at=NOW()
            WHERE id=?
            `,
            [
                userData.first_name,
                userData.last_name,
                userData.email,
                userData.phone,
                userData.role,
                userData.department_id,
                user.id
            ]
        );

        await connection.query(
            `
            UPDATE employee_profiles
            SET
                gender=?,
                date_of_birth=?,
                marital_status=?,
                address=?,
                city=?,
                emergency_contact_name=?,
                emergency_contact_phone=?,
                employment_date=?,
                employment_type=?,
                position_id=?
            WHERE user_id=?
            `,
            [
                userData.gender,
                userData.date_of_birth,
                userData.marital_status,
                userData.address,
                userData.city,
                userData.emergency_contact_name,
                userData.emergency_contact_phone,
                userData.employment_date,
                userData.employment_type,
                userData.position_id,
                user.id
            ]
        );

        await connection.commit();

        return {
            success: true,
            message: "Employee updated successfully."
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }

};

const changeUserStatus = async (userUuid, status) => {

    const allowedStatus = ["active", "inactive"];

    if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status.");
    }

    const user = await userRepository.findByUuid(userUuid);

    if (!user) {
        throw new Error("User not found.");
    }

    await userRepository.updateStatus(user.id, status);

    return {
        success: true,
        message: `User has been ${status}.`
    };

};

const resetPassword = async (userUuid) => {

    const user = await userRepository.findByUuid(userUuid);

    if (!user) {
        throw new Error("User not found.");
    }

    const temporaryPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(
        temporaryPassword,
        10
    );

    await userRepository.updatePassword(
        user.id,
        hashedPassword,
        true
    );

    return {

        success: true,

        message: "Password reset successfully.",

        temporary_password: temporaryPassword

    };

};

const getCurrentUser = async (userId) => {

    const user = await userRepository.findCurrentUser(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    return {
        success: true,
        user
    };

};

const updateEmployeeProfile = async (
  userId,
  data
) => {

  const result =
    await userRepository.updateEmployeeProfile(
      userId,
      data
    );

  if (result.affectedRows === 0) {
    throw new Error(
      "Employee profile not found."
    );
  }

  return {
    success: true,
    message:
      "Profile updated successfully.",
  };
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByUuid,
    updateUser,
    changeUserStatus,
    resetPassword,
    getCurrentUser,
    updateEmployeeProfile
};