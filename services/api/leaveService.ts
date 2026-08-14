import api from "./axios";

export interface LeaveRequest {
  leave_request_uuid: string;
  leave_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  attachment?: string | null;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  review_comment?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export interface LeaveRequestDetails extends LeaveRequest {
  updated_at: string;
  reviewed_by?: string | null;
}

export interface CreateLeaveRequestPayload {
  leave_type_uuid: string;
  start_date: string;
  end_date: string;
  reason: string;
  attachment?: string | null;
}

const leaveService = {
  async getMyLeaveRequests(): Promise<LeaveRequest[]> {
  const response = await api.get("/leaves/me");

  console.log("leaveService response:", response.data);

  return response.data.data.data;
},

  async getLeaveRequestByUuid(
    leaveRequestUuid: string
  ): Promise<LeaveRequestDetails> {
    const response = await api.get(
      `/leaves/${leaveRequestUuid}`
    );

    return response.data.data;
  },

  async createLeaveRequest(
    formData: FormData
  ) {

    const response = await api.post(
      "/leaves",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async cancelLeaveRequest(
    leaveRequestUuid: string
  ) {
    const response = await api.patch(
      `/leaves/${leaveRequestUuid}/cancel`
    );

    return response.data;
  },
};

export default leaveService;