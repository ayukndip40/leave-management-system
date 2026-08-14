const leaveService = require("../services/leaveService");

const createLeaveRequest = async (req, res) => {

    console.log(">>> createLeaveRequest controller reached");

    try {

        console.log("\n========== CREATE LEAVE REQUEST ==========");
        console.log("Authenticated User:");
        console.log(req.user);

        console.log("\nRequest Body:");
        console.log(req.body);

        console.log("\nUploaded Files:");
        console.log(req.files);

        console.log("========== FORM DATA ==========");
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const result = await leaveService.createLeaveRequest(
            req.user,
            req.body,
            req.files || []
        );

        

        console.log("\nService Result:");
        console.log(result);

        return res.status(201).json(result);

    } catch (error) {

        console.error("\n========== CONTROLLER ERROR ==========");
        console.error("Message:", error.message);
        console.error("Stack:");
        console.error(error.stack);

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const getMyLeaveRequests = async (req, res) => {

    try {

        const result = await leaveService.getMyLeaveRequests(
            req.user.user_uuid
        );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getLeaveRequestById = async (req, res) => {

    try {

        const result = await leaveService.getLeaveRequestById(
            req.params.leave_request_uuid,
            req.user.user_uuid
        );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

const cancelLeaveRequest = async (req, res) => {

    try {

        const result = await leaveService.cancelLeaveRequest(
            req.params.leave_request_uuid,
            req.user.user_uuid
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const getAllLeaveRequests = async (
    req,
    res
) => {

    try {

        const result =
            await leaveService.getAllLeaveRequests(
                req.query.status
            );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const approveLeaveRequest = async (req, res) => {

    try {

        const result =
            await leaveService.approveLeaveRequest(
                req.params.leave_request_uuid,
                req.user.id,
                req.user.user_uuid,
                req.body.review_comment
            );

        return res.status(200).json(result);

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const rejectLeaveRequest = async (req, res) => {

    try {

        const result =
            await leaveService.rejectLeaveRequest(
                req.params.leave_request_uuid,
                req.user.id,
                req.user.user_uuid,
                req.body.review_comment
            );

        return res.status(200).json(result);

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const getLeaveRequestByUuidForHr = async (
    req,
    res
) => {

    try {

        const result =
            await leaveService.getLeaveRequestByUuidForHr(
                req.params.leave_request_uuid
            );

        return res.status(200).json(result);

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const getLeaveStatistics = async (
    req,
    res
) => {

    try {

        const result =
            await leaveService.getLeaveStatistics();

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

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