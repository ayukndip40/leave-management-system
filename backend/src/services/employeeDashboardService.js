const repository =
require("../repositories/employeeDashboardRepository");


const getEmployeeDashboard =
async(userId)=>{


const dashboard =
await repository.getEmployeeDashboard(
userId
);


return dashboard;


};


module.exports = {
getEmployeeDashboard
};