const pool = require("../config/db");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");

const login = async ({ login, password }) => {

    const [users] = await pool.query(
        `
        SELECT
            id,
            user_uuid,
            employee_number,
            first_name,
            last_name,
            email,
            password,
            role,
            status,
            must_change_password
        FROM users
        WHERE employee_number = ?
           OR email = ?
        LIMIT 1
        `,
        [login, login]
    );

    if (users.length === 0) {
        throw new Error("Invalid employee number/email or password.");
    }

    const user = users[0];

    if (user.status !== "active") {
        throw new Error("Your account is inactive. Please contact the administrator.");
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
        throw new Error("Invalid employee number/email or password.");
    }

    const token = generateToken(user);

    delete user.password;

    return {
        success: true,
        message: "Login successful.",
        token,
        must_change_password: user.must_change_password,
        user
    };
};

const changeOwnPassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    const user = await userRepository.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    const passwordMatches = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!passwordMatches) {
        throw new Error("Current password is incorrect.");
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    await userRepository.updatePassword(
        user.id,
        hashedPassword,
        false
    );

    return {
        success: true,
        message: "Password changed successfully."
    };

};

module.exports = {
    login,
    changeOwnPassword
};