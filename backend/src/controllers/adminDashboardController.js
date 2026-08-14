const adminDashboardRepository = require("../repositories/dashboardRepository");


const getDashboardStats = async (req, res) => {
    console.log("========== ADMIN DASHBOARD STATS ==========");

    try {

        console.log("Authenticated User:");
        console.log(req.user);


        console.log(
            "Calling adminDashboardRepository.getDashboardStatistics()..."
        );


        const stats =
            await adminDashboardRepository.getDashboardStatistics();


        console.log("Dashboard Statistics Result:");
        console.log(stats);


        res.json({
            success: true,
            data: stats
        });


    } catch (error) {

        console.error(
            "========== DASHBOARD STATS ERROR =========="
        );

        console.error(
            "Message:",
            error.message
        );


        console.error(
            "Stack:",
            error.stack
        );


        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics."
        });

    }
};


module.exports = {
    getDashboardStats
};