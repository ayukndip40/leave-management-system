const departmentRepository = require("../repositories/departmentRepository");

const getAllDepartments = async () => {
    const departments = await departmentRepository.getAllDepartments();

    return {
        success: true,
        message: "Departments retrieved successfully.",
        data: departments,
    };
};

module.exports = {
    getAllDepartments,
};