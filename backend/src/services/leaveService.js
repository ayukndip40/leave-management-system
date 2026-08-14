const pool = require("../config/db");
const leaveRepository = require("../repositories/leaveRepository");
const leaveTypeRepository = require("../repositories/leaveTypeRepository");
const leaveBalanceRepository = require("../repositories/leaveBalanceRepository");
const notificationService = require("./notificationService");
const leaveAttachmentRepository =
    require("../repositories/leaveAttachmentRepository");
const {
    calculateWorkingDays
} = require("../utils/leaveCalculator");
const { v4: uuidv4 } = require("uuid");

const createLeaveRequest = async (user, data, files = []) => {

    // ===========================================
    // 1. Verify Leave Type Exists
    // ===========================================

    const leaveType =
        await leaveTypeRepository.getLeaveTypeByUuid(
            data.leave_type_uuid
        );

    if (!leaveType) {
        throw new Error(
            "Selected leave type does not exist."
        );
    }


    // ===========================================
    // 2. Validate Dates
    // ===========================================

    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (endDate < startDate) {
        throw new Error(
            "End date cannot be before the start date."
        );
    }


    const today = new Date();
    today.setHours(0,0,0,0);

    if (startDate < today) {
        throw new Error(
            "Leave cannot start in the past."
        );
    }



    // ===========================================
    // 3. Calculate Working Days
    // ===========================================

    const totalDays =
        await calculateWorkingDays(
            data.start_date,
            data.end_date
        );


    if (totalDays <= 0) {
        throw new Error(
            "The selected period contains no working days."
        );
    }



    // ===========================================
    // 4. Check Leave Balance
    // ===========================================

    const year = startDate.getFullYear();


    console.log("\n========== SQL LOOKUP ==========");
    console.log({
        userId: user.id,
        leaveTypeId: leaveType.id,
        year
    });



    const balance =
        await leaveBalanceRepository.getLeaveBalance(
            user.id,
            leaveType.id,
            year
        );



    console.log("\n========== LEAVE BALANCE CHECK ==========");
    console.log("User ID:", user.id);
    console.log("Leave Type:", leaveType.leave_name);
    console.log("Remaining:", balance?.remaining_days);



    if (!balance) {
        throw new Error(
            "No leave balance has been assigned for this leave type."
        );
    }



    if (totalDays > balance.remaining_days) {
        throw new Error(
            `Insufficient leave balance. You have ${balance.remaining_days} day(s) remaining.`
        );
    }




    // ===========================================
    // 5. Check Overlapping Leave
    // ===========================================

    const hasOverlap =
        await leaveRepository.hasOverlappingLeave(
            user.id,
            data.start_date,
            data.end_date
        );


    if (hasOverlap) {
        throw new Error(
            "You already have a pending or approved leave request during the selected period."
        );
    }




    // ===========================================
    // 6. Prepare Leave Data
    // ===========================================

    const leaveData = {

    leave_request_uuid: uuidv4(),

    user_id: user.id,

    user_uuid: user.user_uuid,

    leave_type_id: leaveType.id,

    leave_type_uuid: leaveType.leave_type_uuid,

    start_date: data.start_date,

    end_date: data.end_date,

    total_days: totalDays,

    reason: data.reason,

    attachment: null

    };




    // ===========================================
    // 7. Save Leave Request
    // ===========================================

    const leaveRequestId =
        await leaveRepository.createLeaveRequest(
            leaveData
        );





    // ===========================================
    // 8. Save Attachments
    // ===========================================


    if (files && files.length > 0) {


        for (const file of files) {


            await leaveAttachmentRepository.createAttachment({

                leave_request_id:
                    leaveRequestId,


                original_file_name:
                    file.originalname,


                stored_file_name:
                    file.filename,


                file_path:
                    file.path,


                file_type:
                    file.mimetype,


                file_size:
                    file.size,


                uploaded_by:
                    user.id

            });


        }

    }





    // ===========================================
    // 9. Response
    // ===========================================

    return {

        success:true,

        message:
            "Leave request submitted successfully.",


        data:{

            leave_type_uuid:
                leaveType.leave_type_uuid,


            leave_type:
                leaveType.leave_name,


            total_days:
                totalDays,


            status:
                "Pending"

        }

    };

};

const getMyLeaveRequests = async (userId) => {

    const requests =
        await leaveRepository.getMyLeaveRequests(userId);

    return {

        success: true,

        data: requests

    };

};

const getLeaveRequestById = async (leaveId, userId) => {

    const leave =
        await leaveRepository.getLeaveRequestById(
            leaveId,
            userId
        );

    if (!leave) {
        throw new Error("Leave request not found.");
    }

    return {
        success: true,
        data: leave
    };

};

const cancelLeaveRequest = async (leaveId, userId) => {

    const leave =
        await leaveRepository.getLeaveRequestById(
            leaveId,
            userId
        );

    if (!leave) {
        throw new Error(
            "Leave request not found."
        );
    }

    if (leave.status !== "Pending") {
        throw new Error(
            "Only pending leave requests can be cancelled."
        );
    }

    await leaveRepository.cancelLeaveRequest(
        leaveId,
        userId
    );

    return {

        success: true,

        message:
            "Leave request cancelled successfully."

    };

};

const getAllLeaveRequests = async (
    status
) => {

    const leaves =
        await leaveRepository.getAllLeaveRequests(
            status
        );

    return {
        success: true,
        data: leaves
    };

};

const approveLeaveRequest = async (
    leaveRequestUuid,
    reviewedById,
    reviewedByUuid,
    reviewComment
) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        // ===========================================
        // 1. Get Leave Request
        // ===========================================

        const leaveRequest =
            await leaveRepository.getLeaveRequestForApproval(
                leaveRequestUuid,
                connection
            );

        if (!leaveRequest) {
            throw new Error(
                "Leave request not found."
            );
        }

        // ===========================================
        // 2. Ensure Request is Pending
        // ===========================================

        if (leaveRequest.status !== "Pending") {
            throw new Error(
                "Only pending leave requests can be approved."
            );
        }

        // ===========================================
        // 3. Determine Leave Year
        // ===========================================

        const year = leaveRequest.leave_year;

        // ===========================================
        // 4. Deduct Employee Leave Balance
        // ===========================================

        await leaveBalanceRepository.deductLeaveBalance(
            leaveRequest.user_id,
            leaveRequest.leave_type_id,
            year,
            leaveRequest.total_days,
            connection
        );

        // ===========================================
        // 5. Approve Leave Request
        // ===========================================

        await leaveRepository.approveLeaveRequest(
            leaveRequestUuid,
            reviewedById,
            reviewedByUuid,
            reviewComment,
            connection
        );

        // ===========================================
        // 6. Commit
        // ===========================================

        // ===========================================
// 6. Commit Transaction
// ===========================================

await connection.commit();

// ===========================================
// 7. Send Email Notification
// ===========================================

        try {

            await notificationService.sendLeaveApprovedNotification({

                employeeEmail: leaveRequest.email,

                employeeName: `${leaveRequest.first_name} ${leaveRequest.last_name}`,

                leaveType: leaveRequest.leave_name,

                startDate: leaveRequest.start_date,

                endDate: leaveRequest.end_date,

                totalDays: leaveRequest.total_days,

                reviewerName: reviewedByUuid,

                reviewComment,

            });

        } catch (emailError) {

            console.error(
                "Failed to send approval email:",
                emailError.message
            );

            // Do NOT throw the error.
            // The leave has already been approved successfully.
        }

        // ===========================================
        // 8. Return Success
        // ===========================================

        return {
            success: true,
            message: "Leave request approved successfully."
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};

const rejectLeaveRequest = async (
    leaveRequestUuid,
    reviewedById,
    reviewedByUuid,
    reviewComment
) => {

    // ===========================================
    // 1. Retrieve Leave Request
    // ===========================================

    const leaveRequest =
        await leaveRepository.getLeaveRequestForApproval(
            leaveRequestUuid
        );

    if (!leaveRequest) {
        throw new Error(
            "Leave request not found."
        );
    }

    // ===========================================
    // 2. Ensure Request is Pending
    // ===========================================

    if (leaveRequest.status !== "Pending") {
        throw new Error(
            "Only pending leave requests can be rejected."
        );
    }

    // ===========================================
    // 3. Reject Request
    // ===========================================

    await leaveRepository.rejectLeaveRequest(
        leaveRequestUuid,
        reviewedById,
        reviewedByUuid,
        reviewComment
    );

    // ===========================================
    // 4. Send Rejection Email
    // ===========================================

    try {

        await notificationService.sendLeaveRejectedNotification({

            employeeEmail:
                leaveRequest.email,

            employeeName:
                `${leaveRequest.first_name} ${leaveRequest.last_name}`,

            leaveType:
                leaveRequest.leave_name,

            startDate:
                leaveRequest.start_date,

            endDate:
                leaveRequest.end_date,

            totalDays:
                leaveRequest.total_days,

            reviewerName:
                reviewedByUuid,

            reviewComment,

        });

    } catch (emailError) {

        console.error(
            "Failed to send rejection email:",
            emailError.message
        );

        // Important:
        // Do NOT throw the email error.
        //
        // The leave has already been rejected.
        // Email failure must not undo the rejection.
    }

    // ===========================================
    // 5. Return Success
    // ===========================================

    return {
        success: true,
        message:
            "Leave request rejected successfully."
    };
};

const getLeaveRequestByUuidForHr = async (
    leaveRequestUuid
) => {

    const leave =
        await leaveRepository.getLeaveRequestByUuidForHr(
            leaveRequestUuid
        );

    if (!leave) {
        throw new Error(
            "Leave request not found."
        );
    }

    return {
        success: true,
        data: leave
    };

};

const getLeaveStatistics = async () => {

    const rows =
        await leaveRepository.getLeaveStatistics();

    const statistics = {

        pending: 0,

        approved: 0,

        rejected: 0,

        cancelled: 0,

        total: 0

    };

    rows.forEach((row) => {

        switch (row.status) {

            case "Pending":

                statistics.pending = Number(row.total);

                break;

            case "Approved":

                statistics.approved = Number(row.total);

                break;

            case "Rejected":

                statistics.rejected = Number(row.total);

                break;

            case "Cancelled":

                statistics.cancelled = Number(row.total);

                break;

        }

    });

    statistics.total =
        statistics.pending +
        statistics.approved +
        statistics.rejected +
        statistics.cancelled;

    return {

        success: true,

        data: statistics

    };

};

module.exports = {
    createLeaveRequest,
    getMyLeaveRequests,
    getLeaveRequestById,
    cancelLeaveRequest,
    getAllLeaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    getLeaveRequestByUuidForHr,
    getLeaveStatistics
};