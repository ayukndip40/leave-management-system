const leaveTypeRepository = require("../repositories/leaveTypeRepository");

const getAllLeaveTypes = async () => {

    const leaveTypes = await leaveTypeRepository.getAllLeaveTypes();

    return {
        success: true,
        data: leaveTypes
    };

};

const getLeaveTypeByUuid = async (leaveTypeUuid) => {

    const leaveType = await leaveTypeRepository.getLeaveTypeByUuid(
        leaveTypeUuid
    );

    if (!leaveType) {
        throw new Error("Leave type not found.");
    }

    return {
        success: true,
        data: leaveType
    };

};

const createLeaveType = async (leaveTypeData) => {

    return await leaveTypeRepository.createLeaveType(
        leaveTypeData
    );

};

module.exports = {
    getAllLeaveTypes,
    getLeaveTypeByUuid,
    createLeaveType
};