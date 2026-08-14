const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");
const {changePasswordValidation, validate} = require("../validators/userValidator")

router.post("/login", authController.login);

router.put(
    "/change-password",
    authenticate,
    changePasswordValidation,
    validate,
    authController.changeOwnPassword
);

router.get(
    "/me",
    authenticate,
    authController.getCurrentUser
);

module.exports = router;