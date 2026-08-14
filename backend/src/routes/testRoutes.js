const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get(
    "/admin",
    authenticate,
    authorize("admin"),
    (req, res) => {

        res.json({
            success: true,
            message: "Welcome Admin!",
            user: req.user
        });

    }
);

module.exports = router;