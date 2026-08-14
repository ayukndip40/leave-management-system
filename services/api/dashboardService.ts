import api from "./axios";


export interface AdminDashboardStats {
  employees: number;
  departments: number;
  leaveTypes: number;
  hrUsers: number;
}


export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
}


const dashboardService = {

  async getAdminStats(): Promise<AdminDashboardStats> {

    const response = await api.get(
    "/admin/dashboard/stats"
  );


  console.log(
    "ADMIN DASHBOARD RESPONSE:",
    response.data
  );

    return response.data.data;

  },


  async getRecentActivities(): Promise<RecentActivity[]> {

    const response = await api.get(
      "/dashboard/admin/activity"
    );

    return response.data;

  },

};


export default dashboardService;