const { body, validationResult } = require("express-validator");

const createLeaveRequestValidation = [

    body("leave_type_uuid")
        .trim()
        .notEmpty()
        .withMessage("Leave type is required.")
        .isUUID()
        .withMessage("Invalid leave type."),

    body("start_date")
        .isISO8601()
        .withMessage("Start date is invalid."),

    body("end_date")
        .isISO8601()
        .withMessage("End date is invalid."),

    body("reason")
        .trim()
        .notEmpty()
        .withMessage("Reason is required.")
        .isLength({ min: 10, max: 1000 })
        .withMessage("Reason must be between 10 and 1000 characters."),

    body("delegate_user_uuid")
        .optional({ nullable: true, checkFalsy: true })
        .isUUID()
        .withMessage("Invalid delegate employee.")

];

const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            success: false,
            errors: errors.array()
        });

    }

    next();

};

module.exports = {
    createLeaveRequestValidation,
    validate
};