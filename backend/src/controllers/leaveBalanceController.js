const leaveBalanceService = require("../services/leaveBalanceService");

const getMyLeaveBalances = async (req, res) => {

    try {

        const result = await leaveBalanceService.getMyLeaveBalances(req.user.id);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const initializeLeaveBalances = async (req, res) => {

    try {

        const result =
            await leaveBalanceService.initializeLeaveBalances();

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getMyLeaveBalances,
    initializeLeaveBalances
};