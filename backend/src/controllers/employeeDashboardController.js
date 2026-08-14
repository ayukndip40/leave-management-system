const employeeDashboardRepository =
require("../repositories/employeeDashboardRepository");


const getEmployeeDashboard = async (
req,
res
)=>{

try{

    console.log(
        "Logged employee:",
        req.user
    );


    const data =
    await employeeDashboardRepository
    .getEmployeeDashboard(
        req.user.id
    );


    res.json({
        success:true,
        data
    });


}catch(error){

    console.error(
        "Employee dashboard error:",
        error
    );


    res.status(500).json({
        success:false,
        message:
        "Failed to load employee dashboard."
    });

}

};


module.exports = {
    getEmployeeDashboard
};