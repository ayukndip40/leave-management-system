const express = require("express");

const router = express.Router();

const {
    getEmployeeDashboard
} = require("../controllers/employeeDashboardController");


const 
    authenticate
 = require("../middleware/authMiddleware");


const authorize = require("../middleware/roleMiddleware");


router.get(
    "/",
    authenticate,
    authorize("employee"),
    getEmployeeDashboard
);


module.exports = router;