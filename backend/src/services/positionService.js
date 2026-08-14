const positionRepository = require("../repositories/positionRepository");

const getAllPositions = async () => {
    const positions = await positionRepository.getAllPositions();

    return {
        success: true,
        message: "Positions retrieved successfully.",
        data: positions,
    };
};

module.exports = {
    getAllPositions,
};