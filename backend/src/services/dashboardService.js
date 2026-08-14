const dashboardRepository = require("../repositories/dashboardRepository");


const getAdminDashboard = async () => {

    const statistics =
        await dashboardRepository.getStatistics();


    const recentActivities =
        await dashboardRepository.getRecentActivities();


    return {
        statistics,
        recentActivities
    };

};


module.exports = {
    getAdminDashboard
};