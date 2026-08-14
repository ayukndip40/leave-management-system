import api from "./axios";


export interface EmployeeDashboardStats {
  leaveBalance: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
}


export interface EmployeeActivity {
  id: number;
  title: string;
  description: string;
  time: string;
}


const employeeDashboardService = {


  async getStats(): Promise<EmployeeDashboardStats> {

    try {

      const response = await api.get(
        "/employee/dashboard"
      );


      const dashboard =
        response.data.data;


      const balances =
        dashboard.leaveBalances || [];


      const leaves =
        dashboard.recentLeaves || [];


      return {

        leaveBalance:
          balances.reduce(
            (
              total: number,
              item: any
            ) =>
              total + item.remaining_days,
            0
          ),


        pendingLeaves:
          leaves.filter(
            (item: any) =>
              item.status === "Pending"
          ).length,


        approvedLeaves:
          leaves.filter(
            (item: any) =>
              item.status === "Approved"
          ).length,


        rejectedLeaves:
          leaves.filter(
            (item: any) =>
              item.status === "Rejected"
          ).length,

      };


    } catch(error) {


      console.log(
        "Employee stats error:",
        error
      );


      return {

        leaveBalance: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0,

      };

    }

  },



  async getActivities(): Promise<EmployeeActivity[]> {


    try {


      const response =
        await api.get(
          "/employee/dashboard"
        );


      const leaves =
        response.data.data.recentLeaves || [];



      return leaves.map(
        (item: any) => ({

          id:
            item.leave_request_uuid,


          title:
            item.leave_name,


          description:
            `${item.status} (${item.total_days} days)`,


          time:
            new Date(
              item.created_at
            ).toLocaleDateString(),

        })
      );


    } catch(error) {


      console.log(
        "Employee activity error:",
        error
      );


      return [];

    }

  },


};


export default employeeDashboardService;