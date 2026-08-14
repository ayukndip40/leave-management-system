import api from "./axios";

export interface LeaveBalance {
  id: number;
  leave_name: string;
  maximum_days: number;
  allocated_days: number;
  used_days: number;
  remaining_days: number;
  year: number;
}

const leaveBalanceService = {
  async getMyLeaveBalances(): Promise<LeaveBalance[]> {
    const response = await api.get("/leave-balances/me");

    return response.data.data;
  },
};

export default leaveBalanceService;