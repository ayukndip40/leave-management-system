const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const leaveController = require("../controllers/leaveController");

const {
  createLeaveRequestValidation,
  validate,
} = require("../validators/leaveValidator");

// ===========================================
// Employee - Create Leave Request
// ===========================================

router.post(
    "/",
    authenticate,
    upload.array("attachments", 3),
    createLeaveRequestValidation,
    validate,
    leaveController.createLeaveRequest
);

// ===========================================
// HR/Admin - View All Leave Requests
// ===========================================

router.get(
  "/",
  authenticate,
  authorize("admin", "hr"),
  leaveController.getAllLeaveRequests
);

// ===========================================
// Employee - My Leave Requests
// ===========================================

router.get(
  "/me",
  authenticate,
  leaveController.getMyLeaveRequests
);

// ===========================================
// HR/Admin - Leave Statistics
// ===========================================

router.get(
  "/statistics",
  authenticate,
  authorize("admin", "hr"),
  leaveController.getLeaveStatistics
);

// ===========================================
// HR/Admin - View Leave Details
// ===========================================

router.get(
  "/hr/:leave_request_uuid",
  authenticate,
  authorize("admin", "hr"),
  leaveController.getLeaveRequestByUuidForHr
);

// ===========================================
// Employee - Cancel Leave Request
// ===========================================

router.patch(
  "/:leave_request_uuid/cancel",
  authenticate,
  leaveController.cancelLeaveRequest
);

// ===========================================
// HR/Admin - Approve Leave Request
// ===========================================

router.patch(
  "/:leave_request_uuid/approve",
  authenticate,
  authorize("admin", "hr"),
  leaveController.approveLeaveRequest
);

// ===========================================
// HR/Admin - Reject Leave Request
// ===========================================

router.patch(
  "/:leave_request_uuid/reject",
  authenticate,
  authorize("admin", "hr"),
  leaveController.rejectLeaveRequest
);

// ===========================================
// Employee - View Leave Details
// MUST BE LAST because it matches any UUID.
// ===========================================

router.get(
  "/:leave_request_uuid",
  authenticate,
  leaveController.getLeaveRequestById
);

module.exports = router;