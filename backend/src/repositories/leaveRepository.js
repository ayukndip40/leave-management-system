const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");


const createLeaveRequest = async (data) => {

    const leaveRequestUuid = uuidv4();

    const [result] = await pool.query(
        `
        INSERT INTO leave_requests
        (
            leave_request_uuid,
            user_id,
            user_uuid,
            leave_type_id,
            leave_type_uuid,
            start_date,
            end_date,
            total_days,
            reason,
            attachment
        )
        VALUES (?,?,?,?,?,?,?,?,?,?)
        `,
        [
            leaveRequestUuid,
            data.user_id,
            data.user_uuid,
            data.leave_type_id,
            data.leave_type_uuid,
            data.start_date,
            data.end_date,
            data.total_days,
            data.reason,
            data.attachment || null
        ]
    );


    return result.insertId;

};



const hasOverlappingLeave = async (
    userUuid,
    startDate,
    endDate
) => {

    const [rows] = await pool.query(
        `
        SELECT leave_request_uuid
        FROM leave_requests
        WHERE user_uuid = ?
        AND status IN ('Pending','Approved')
        AND (
            start_date <= ?
            AND end_date >= ?
        )
        LIMIT 1
        `,
        [
            userUuid,
            endDate,
            startDate
        ]
    );


    return rows.length > 0;

};



const getMyLeaveRequests = async (userUuid) => {

    const [rows] = await pool.query(
        `
        SELECT

            lr.leave_request_uuid,

            lt.leave_name,

            lr.start_date,
            lr.end_date,
            lr.total_days,

            lr.reason,
            lr.attachment,

            lr.status,

            lr.review_comment,
            lr.reviewed_at,

            lr.created_at


        FROM leave_requests lr


        INNER JOIN leave_types lt

            ON lr.leave_type_uuid = lt.leave_type_uuid


        WHERE lr.user_uuid = ?


        ORDER BY lr.created_at DESC
        `,
        [userUuid]
    );


    return rows;

};



const getLeaveRequestById = async (
    leaveRequestUuid,
    userUuid
) => {


    const [rows] = await pool.query(
        `
        SELECT

            lr.leave_request_uuid,

            lt.leave_name,

            lr.start_date,
            lr.end_date,

            lr.total_days,

            lr.reason,

            lr.attachment,

            lr.status,

            lr.review_comment,

            lr.reviewed_at,


            CONCAT(
                u.first_name,
                ' ',
                u.last_name
            ) AS reviewed_by,


            lr.created_at,
            lr.updated_at


        FROM leave_requests lr


        INNER JOIN leave_types lt

            ON lr.leave_type_uuid = lt.leave_type_uuid


        LEFT JOIN users u

            ON lr.reviewed_by_uuid = u.user_uuid


        WHERE lr.leave_request_uuid = ?

        AND lr.user_uuid = ?


        LIMIT 1
        `,
        [
            leaveRequestUuid,
            userUuid
        ]
    );


    return rows[0] || null;

};



const cancelLeaveRequest = async (
    leaveRequestUuid,
    userUuid
) => {


    const [result] = await pool.query(
        `
        UPDATE leave_requests

        SET status = 'Cancelled'

        WHERE leave_request_uuid = ?

        AND user_uuid = ?

        AND status = 'Pending'
        `,
        [
            leaveRequestUuid,
            userUuid
        ]
    );


    return result;

};

const getAllLeaveRequests = async (
    status = null
) => {

    let query = `
        SELECT

            lr.leave_request_uuid,

            u.employee_number,

            CONCAT(
                u.first_name,
                ' ',
                u.last_name
            ) AS employee_name,

            lt.leave_name,

            lr.start_date,
            lr.end_date,

            lr.total_days,

            lr.reason,

            lr.attachment,

            lr.status,

            lr.created_at

        FROM leave_requests lr

        INNER JOIN users u
            ON lr.user_id = u.id

        INNER JOIN leave_types lt
            ON lr.leave_type_id = lt.id
    `;

    const params = [];

    if (status) {

        query += `
            WHERE lr.status = ?
        `;

        params.push(status);

    }

    query += `
        ORDER BY
            lr.created_at DESC
    `;

    const [rows] = await pool.query(
        query,
        params
    );

    return rows;

};

const approveLeaveRequest = async (
    leaveRequestUuid,
    reviewedById,
    reviewedByUuid,
    reviewComment,
    connection = pool
) => {

    const [result] = await connection.query(
        `
        UPDATE leave_requests

        SET
            status = 'Approved',
            reviewed_by = ?,
            reviewed_by_uuid = ?,
            reviewed_at = NOW(),
            review_comment = ?

        WHERE
            leave_request_uuid = ?
            AND status = 'Pending'
        `,
        [
            reviewedById,
            reviewedByUuid,
            reviewComment || null,
            leaveRequestUuid
        ]
    );

    if (result.affectedRows === 0) {
        throw new Error(
            "Leave request has already been processed."
        );
    }

    return result;

};

const getLeaveRequestForApproval = async (
  leaveRequestUuid,
  connection = pool
) => {
  const [rows] = await connection.query(
    `
    SELECT
        lr.id,
        lr.leave_request_uuid,

        lr.user_id,
        lr.user_uuid,

        lr.leave_type_id,
        lr.leave_type_uuid,

        lt.leave_name,

        u.email,
        u.first_name,
        u.last_name,

        lr.start_date,
        lr.end_date,

        YEAR(lr.start_date) AS leave_year,

        lr.total_days,

        lr.status

    FROM leave_requests lr

    INNER JOIN users u
        ON lr.user_id = u.id

    INNER JOIN leave_types lt
        ON lr.leave_type_id = lt.id

    WHERE lr.leave_request_uuid = ?

    LIMIT 1
    `,
    [leaveRequestUuid]
  );

  return rows[0] || null;
};

const rejectLeaveRequest = async (
    leaveRequestUuid,
    reviewedById,
    reviewedByUuid,
    reviewComment,
    connection = pool
) => {

    const [result] = await connection.query(
        `
        UPDATE leave_requests

        SET
            status = 'Rejected',
            reviewed_by = ?,
            reviewed_by_uuid = ?,
            reviewed_at = NOW(),
            review_comment = ?

        WHERE
            leave_request_uuid = ?
            AND status = 'Pending'
        `,
        [
            reviewedById,
            reviewedByUuid,
            reviewComment || null,
            leaveRequestUuid
        ]
    );

    if (result.affectedRows === 0) {
        throw new Error(
            "Leave request has already been processed."
        );
    }

    return result;

};

const getLeaveRequestByUuidForHr = async (
    leaveRequestUuid
) => {

    const [rows] = await pool.query(
        `
        SELECT

            lr.leave_request_uuid,

            u.employee_number,

            CONCAT(
                u.first_name,
                ' ',
                u.last_name
            ) AS employee_name,

            lt.leave_name,

            lr.start_date,
            lr.end_date,

            lr.total_days,

            lr.reason,

            lr.status,

            lr.review_comment,

            lr.reviewed_at,

            CONCAT(
                reviewer.first_name,
                ' ',
                reviewer.last_name
            ) AS reviewed_by,

            lr.created_at,
            lr.updated_at,

            JSON_ARRAYAGG(
                IF(
                    la.id IS NULL,
                    NULL,
                    JSON_OBJECT(
                        'id', la.id,
                        'original_file_name', la.original_file_name,
                        'stored_file_name', la.stored_file_name,
                        'file_path', la.file_path,
                        'file_type', la.file_type,
                        'file_size', la.file_size
                    )
                )
            ) AS attachments

        FROM leave_requests lr

        INNER JOIN users u
            ON lr.user_id = u.id

        INNER JOIN leave_types lt
            ON lr.leave_type_id = lt.id

        LEFT JOIN users reviewer
            ON lr.reviewed_by = reviewer.id

        LEFT JOIN leave_attachments la
            ON la.leave_request_id = lr.id

        WHERE lr.leave_request_uuid = ?

        GROUP BY
            lr.id,
            u.employee_number,
            employee_name,
            lt.leave_name,
            reviewer.first_name,
            reviewer.last_name

        LIMIT 1
        `,
        [leaveRequestUuid]
    );

    if (!rows.length) {
    return null;
        }

        const leave = rows[0];

        if (typeof leave.attachments === "string") {
            leave.attachments = JSON.parse(
                leave.attachments
            );
        }

        return leave;

    return rows[0] || null;

};

const getLeaveAttachments = async (leaveRequestId) => {

    const [rows] = await pool.query(
        `
        SELECT
            id,
            original_file_name,
            stored_file_name,
            file_path,
            file_type,
            file_size,
            uploaded_at
        FROM leave_attachments
        WHERE leave_request_id = ?
        ORDER BY uploaded_at ASC
        `,
        [leaveRequestId]
    );

    return rows;
};

const getLeaveStatistics = async () => {

    const [rows] = await pool.query(
        `
        SELECT

            status,

            COUNT(*) AS total

        FROM leave_requests

        GROUP BY status
        `
    );

    return rows;

};

module.exports = {

    createLeaveRequest,

    hasOverlappingLeave,

    getMyLeaveRequests,

    getLeaveRequestById,

    cancelLeaveRequest,

    getAllLeaveRequests,

    approveLeaveRequest,

    getLeaveRequestForApproval,

    rejectLeaveRequest,

    getLeaveRequestByUuidForHr,

    getLeaveAttachments,

    getLeaveStatistics

};