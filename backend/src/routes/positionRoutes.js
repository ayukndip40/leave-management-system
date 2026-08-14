console.log("✅ positionRoutes loaded");
const express = require("express");
const router = express.Router();

const positionController = require("../controllers/positionController");
const authenticate = require("../middleware/authMiddleware");

// Get all positions
router.get(
    "/",
    authenticate,
    positionController.getAllPositions
);

module.exports = router;