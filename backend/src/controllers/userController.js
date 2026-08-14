const userService = require("../services/userService");

const createUser = async (req, res) => {

    try {

        const result = await userService.createUser(req.body);

        return res.status(201).json(result);

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getAllUsers = async (req, res) => {

    try {

        const result = await userService.getAllUsers(req.query);

        res.json(result);

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getUserByUuid = async (req, res) => {

    try {

        const result = await userService.getUserByUuid(req.params.user_uuid);

        res.json(result);

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

const updateUser = async (req, res) => {

    try {

        const result = await userService.updateUser(
            req.params.user_uuid,
            req.body
        );

        res.json(result);

        

    } catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

};

const changeUserStatus = async (req, res) => {

    try {

        const result = await userService.changeUserStatus(
            req.params.user_uuid,
            req.body.status
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const resetPassword = async (req, res) => {

    try {

        const result = await userService.resetPassword(
            req.params.user_uuid
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

const updateEmployeeProfile = async (
  req,
  res
) => {

  try {

    const userId = req.user.id;

    const {
      marital_status,
      address,
      city,
      emergency_contact_name,
      emergency_contact_phone,
    } = req.body;


    const result =
      await userService.updateEmployeeProfile(
        userId,
        {
          marital_status,
          address,
          city,
          emergency_contact_name,
          emergency_contact_phone,
        }
      );


    return res.status(200).json(
      result
    );

  } catch (error) {

    console.error(
      "Update employee profile error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByUuid,
    updateUser,
    changeUserStatus,
    resetPassword,
    updateEmployeeProfile
};