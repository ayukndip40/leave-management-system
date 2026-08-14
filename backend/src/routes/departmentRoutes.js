console.log("✅ departmentRoutes loaded");
const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/departmentController");
const authenticate = require("../middleware/authMiddleware");

// Get all departments
router.get(
    "/",
    authenticate,
    departmentController.getAllDepartments
);

module.exports = router;