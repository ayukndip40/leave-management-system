const positionService = require("../services/positionService");

const getAllPositions = async (req, res) => {
    try {
        const result = await positionService.getAllPositions();

        return res.status(200).json(result);
    } catch (error) {
        console.error("Get Positions Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve positions.",
        });
    }
};

module.exports = {
    getAllPositions,
};