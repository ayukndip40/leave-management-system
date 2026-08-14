const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const leaveTypeController = require("../controllers/leaveTypeController");

const {
    createLeaveTypeValidation,
    validate
} = require("../validators/leaveTypeValidator");

// Create Leave Type
router.post(
    "/",
    authenticate,
    authorize("admin"),
    createLeaveTypeValidation,
    validate,
    leaveTypeController.createLeaveType
);

// Get all Leave Types
router.get(
    "/",
    authenticate,
    authorize("admin", "hr", "employee"),
    leaveTypeController.getAllLeaveTypes
);

// Get Leave Type by UUID
router.get(
    "/:leave_type_uuid",
    authenticate,
    authorize("admin", "hr"),
    leaveTypeController.getLeaveTypeByUuid
);

module.exports = router;