const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const userController = require("../controllers/userController");
const {
    createUserValidation,
    updateStatusValidation,
    validate
} = require("../validators/userValidator");

router.post(
    "/",
    authenticate,
    authorize("admin"),
    createUserValidation,
    validate,
    userController.createUser
);

router.get(
    "/",
    authenticate,
    authorize("admin", "hr"),
    userController.getAllUsers
);

router.put(
  "/profile",
  authenticate,
  authorize("employee"),
  userController.updateEmployeeProfile
);

router.get(
    "/:user_uuid",
    authenticate,
    authorize("admin", "hr"),
    userController.getUserByUuid
);

router.put(
    "/:user_uuid",
    authenticate,
    authorize("admin"),
    createUserValidation,
    validate,
    userController.updateUser
);

router.patch(
    "/:user_uuid/status",
    authenticate,
    authorize("admin"),
    updateStatusValidation,
    validate,
    userController.changeUserStatus
);

router.post(
    "/:user_uuid/reset-password",
    authenticate,
    authorize("admin", "hr"),
    userController.resetPassword
);

module.exports = router;