const express = require("express");

const router = express.Router();

const {
    getDashboardStats
} = require("../controllers/adminDashboardController");


const 
    authenticate
 = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");


router.get(
    "/stats",
    authenticate,
    authorize("admin"),
    getDashboardStats
);


module.exports = router;