const leaveTypeService = require("../services/leaveTypeService");

const getAllLeaveTypes = async (req, res) => {

    try {

        const result = await leaveTypeService.getAllLeaveTypes();

        res.status(200).json(result);

    } catch (error) {

        console.error("Get Leave Types Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getLeaveTypeByUuid = async (req, res) => {

    try {

        const { leave_type_uuid } = req.params;

        const result = await leaveTypeService.getLeaveTypeByUuid(
            leave_type_uuid
        );

        res.status(200).json(result);

    } catch (error) {

        console.error("Get Leave Type Error:", error);

        if (error.message === "Leave type not found.") {

            return res.status(404).json({
                success: false,
                message: error.message
            });

        }

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const createLeaveType = async (req, res) => {

    try {

        const result = await leaveTypeService.createLeaveType(
            req.body
        );

        res.status(201).json(result);

    } catch (error) {

        console.error("Create Leave Type Error:", error);

        if (error.message === "Leave type already exists.") {

            return res.status(409).json({
                success: false,
                message: error.message
            });

        }

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getAllLeaveTypes,
    getLeaveTypeByUuid,
    createLeaveType
};