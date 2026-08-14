const { body, validationResult } = require("express-validator");

const createLeaveTypeValidation = [

    body("leave_name")
        .trim()
        .notEmpty()
        .withMessage("Leave name is required."),

    body("maximum_days")
        .isInt({ min: 1 })
        .withMessage("Maximum days must be at least 1."),

    body("paid_leave")
        .isBoolean()
        .withMessage("Paid leave must be true or false."),

    body("requires_document")
        .isBoolean()
        .withMessage("Requires document must be true or false."),

    body("color")
        .trim()
        .notEmpty()
        .withMessage("Color is required."),

    body("description")
        .optional()
        .trim()

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
    createLeaveTypeValidation,
    validate
};