const leaveBalanceRepository = require("../repositories/leaveBalanceRepository");

const getMyLeaveBalances = async (userId) => {

    const balances =
        await leaveBalanceRepository.getUserLeaveBalances(
            userId
        );

    return {
        success: true,
        data: balances
    };

};

const getLeaveBalance = async (
    userId,
    leaveTypeId,
    year
) => {

    return await leaveBalanceRepository.getLeaveBalance(
        userId,
        leaveTypeId,
        year
    );

};

const initializeLeaveBalances = async () => {

    const year = new Date().getFullYear();

    await leaveBalanceRepository.initializeExistingEmployeesLeaveBalances(
        year
    );

    return {
        success: true,
        message: "Leave balances initialized successfully."
    };

};

module.exports = {
    getMyLeaveBalances,
    getLeaveBalance,
    initializeLeaveBalances
};