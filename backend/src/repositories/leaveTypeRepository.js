const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const getAllLeaveTypes = async () => {

    const [rows] = await pool.query(
        `
        SELECT
            leave_type_uuid,
            leave_name,
            description,
            maximum_days,
            paid_leave,
            requires_document,
            color,
            status,
            created_at,
            updated_at
        FROM leave_types
        ORDER BY leave_name ASC
        `
    );

    return rows;

};

const getLeaveTypeByUuid = async (leaveTypeUuid) => {

    const [rows] = await pool.query(
        `
        SELECT
            id,
            leave_type_uuid,
            leave_name,
            description,
            maximum_days,
            paid_leave,
            requires_document,
            color,
            status,
            created_at,
            updated_at
        FROM leave_types
        WHERE leave_type_uuid = ?
        LIMIT 1
        `,
        [leaveTypeUuid]
    );

    return rows[0] || null;

};

const createLeaveType = async (leaveTypeData) => {

    const {
        leave_name,
        description,
        maximum_days,
        paid_leave,
        requires_document,
        color
    } = leaveTypeData;

    // Check for duplicate leave name
    const [existingLeaveType] = await pool.query(
        `
        SELECT id
        FROM leave_types
        WHERE leave_name = ?
        LIMIT 1
        `,
        [leave_name]
    );

    if (existingLeaveType.length > 0) {
        throw new Error("Leave type already exists.");
    }

    const leaveTypeUuid = uuidv4();

    await pool.query(
        `
        INSERT INTO leave_types
        (
            leave_type_uuid,
            leave_name,
            description,
            maximum_days,
            paid_leave,
            requires_document,
            color
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            leaveTypeUuid,
            leave_name,
            description,
            maximum_days,
            paid_leave,
            requires_document,
            color
        ]
    );

    return {
        success: true,
        message: "Leave type created successfully."
    };

};

module.exports = {
    getAllLeaveTypes,
    getLeaveTypeByUuid,
    createLeaveType
};