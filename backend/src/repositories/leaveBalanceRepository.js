const pool = require("../config/db");

const getUserLeaveBalances = async (userId) => {

    const [rows] = await pool.query(
        `
        SELECT
            lb.id,
            lt.leave_name,
            lt.maximum_days,
            lb.allocated_days,
            lb.used_days,
            lb.remaining_days,
            lb.year

        FROM leave_balances lb

        INNER JOIN leave_types lt
            ON lt.id = lb.leave_type_id

        WHERE lb.user_id = ?

        ORDER BY lt.leave_name
        `,
        [userId]
    );

    return rows;
};

const getLeaveBalance = async (
    userId,
    leaveTypeId,
    year
) => {

     console.log("\n========== SQL LOOKUP ==========");
    console.log({
        userId,
        leaveTypeId,
        year
    });

    const [rows] = await pool.query(
        `
        SELECT
            id,
            allocated_days,
            used_days,
            remaining_days
        FROM leave_balances
        WHERE user_id = ?
          AND leave_type_id = ?
          AND year = ?
        LIMIT 1
        `,
        [
            userId,
            leaveTypeId,
            year
        ]
    );

    return rows[0] || null;

};

const initializeEmployeeLeaveBalances = async (
    userId,
    year,
    connection = pool
) => {

    // Get every active leave type
    const [leaveTypes] = await connection.query(
        `
        SELECT
            id,
            maximum_days
        FROM leave_types
        WHERE status = 'active'
        `
    );

    // Create one balance for each leave type
    for (const leaveType of leaveTypes) {

        await connection.query(
            `
            INSERT INTO leave_balances
            (
                user_id,
                leave_type_id,
                allocated_days,
                used_days,
                remaining_days,
                year
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                userId,
                leaveType.id,
                leaveType.maximum_days,
                0,
                leaveType.maximum_days,
                year
            ]
        );

    }

    return true;

};

const initializeExistingEmployeesLeaveBalances = async (
    year,
    connection = pool
) => {

    const [employees] = await connection.query(
        `
        SELECT id
        FROM users
        WHERE role = 'employee'
        `
    );

    const [leaveTypes] = await connection.query(
        `
        SELECT
            id,
            maximum_days
        FROM leave_types
        WHERE status = 'active'
        `
    );

    for (const employee of employees) {

        for (const leaveType of leaveTypes) {

            const [existing] = await connection.query(
                `
                SELECT id
                FROM leave_balances
                WHERE user_id = ?
                  AND leave_type_id = ?
                  AND year = ?
                LIMIT 1
                `,
                [
                    employee.id,
                    leaveType.id,
                    year
                ]
            );

            if (existing.length === 0) {

                await connection.query(
                    `
                    INSERT INTO leave_balances
                    (
                        user_id,
                        leave_type_id,
                        allocated_days,
                        used_days,
                        remaining_days,
                        year
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    `,
                    [
                        employee.id,
                        leaveType.id,
                        leaveType.maximum_days,
                        0,
                        leaveType.maximum_days,
                        year
                    ]
                );

            }

        }

    }

    return true;

};

const deductLeaveBalance = async (
    userId,
    leaveTypeId,
    year,
    totalDays,
    connection = pool
) => {

    const [result] = await connection.query(
        `
        UPDATE leave_balances

        SET
            used_days = used_days + ?,
            remaining_days = remaining_days - ?

        WHERE
            user_id = ?
            AND leave_type_id = ?
            AND year = ?
            AND remaining_days >= ?
        `,
        [
            totalDays,
            totalDays,
            userId,
            leaveTypeId,
            year,
            totalDays
        ]
    );

    if (result.affectedRows === 0) {
        throw new Error(
            "Insufficient leave balance."
        );
    }

    return result;

};

module.exports = {
    getUserLeaveBalances,
    getLeaveBalance,
    initializeEmployeeLeaveBalances,
    initializeExistingEmployeesLeaveBalances,
    deductLeaveBalance
};