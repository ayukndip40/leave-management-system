const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const leaveBalanceController = require("../controllers/leaveBalanceController");

router.get(
    "/me",
    authenticate,
    leaveBalanceController.getMyLeaveBalances
);

router.post(
    "/initialize",
    authenticate,
    authorize("admin"),
    leaveBalanceController.initializeLeaveBalances
);

module.exports = router;