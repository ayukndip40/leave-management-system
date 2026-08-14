const authService = require("../services/authService");
const userService = require("../services/userService");
const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const changeOwnPassword = async (req, res) => {

    try {

        const result = await userService.changeOwnPassword(

            req.user.id,

            req.body.current_password,

            req.body.new_password

        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({

            success: false,
            message: error.message

        });

    }

};

const getCurrentUser = async (req, res) => {

    try {

        const result = await userService.getCurrentUser(req.user.id);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    login,
    changeOwnPassword,
    getCurrentUser
};