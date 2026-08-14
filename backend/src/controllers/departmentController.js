

const departmentService = require('../services/departmentService');

const getAllDepartments = async (req, res) => {
    try {
        const result = await departmentService.getAllDepartments();

        return res.status(200).json(result);

    } catch (error) {
        console.error('Get departments error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve departments.',
        });
    }
};

module.exports = {
    getAllDepartments,
};