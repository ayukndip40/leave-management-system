const pool = require("../config/db");


const createAttachment = async (
    data,
    connection = pool
) => {

    const [result] = await connection.query(
        `
        INSERT INTO leave_attachments
        (
            leave_request_id,
            original_file_name,
            stored_file_name,
            file_path,
            file_type,
            file_size,
            uploaded_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [

            data.leave_request_id,

            data.original_file_name,

            data.stored_file_name,

            data.file_path,

            data.file_type,

            data.file_size,

            data.uploaded_by

        ]
    );


    return result.insertId;

};


const getAttachmentsByLeaveRequestId = async (
    leaveRequestId
) => {

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

        ORDER BY uploaded_at DESC

        `,
        [
            leaveRequestId
        ]
    );


    return rows;

};


module.exports = {

    createAttachment,

    getAttachmentsByLeaveRequestId

};