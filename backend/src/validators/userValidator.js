const { body, validationResult } = require("express-validator");

const createUserValidation = [

    body("first_name")
        .trim()
        .notEmpty()
        .withMessage("First name is required."),

    body("last_name")
        .trim()
        .notEmpty()
        .withMessage("Last name is required."),

    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required."),

    body("role")
        .isIn(["admin", "hr", "employee"])
        .withMessage("Invalid role."),

    body("department_id")
        .isInt({ min: 1 })
        .withMessage("Department is required."),

    body("position_id")
        .isInt({ min: 1 })
        .withMessage("Position is required."),

    body("gender")
        .isIn(["Male", "Female", "Other"])
        .withMessage("Invalid gender."),

    body("employment_type")
        .isIn(["Permanent", "Contract", "Temporary", "Intern"])
        .withMessage("Invalid employment type."),

    body("employment_date")
        .isISO8601()
        .withMessage("Employment date is invalid."),

    body("date_of_birth")
        .isISO8601()
        .withMessage("Date of birth is invalid.")
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

const updateStatusValidation = [

    body("status")
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive.")

];

const changePasswordValidation = [

    body("current_password")
        .notEmpty()
        .withMessage("Current password is required."),

    body("new_password")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long.")

];

module.exports = {
    createUserValidation,
    updateStatusValidation,
    changePasswordValidation,
    validate
};