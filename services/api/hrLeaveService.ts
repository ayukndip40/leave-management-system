import api from "./axios";

export interface HrLeaveRequestDetails
  extends HrLeaveRequest {

  review_comment?: string | null;

  reviewed_at?: string | null;

  reviewed_by?: string | null;

  updated_at: string;

}

export interface LeaveStatistics {

  pending: number;

  approved: number;

  rejected: number;

  cancelled: number;

  total: number;

}

export interface HrLeaveRequest {
  leave_request_uuid: string;

  employee_name: string;
  employee_number: string;

  leave_name: string;

  start_date: string;
  end_date: string;

  total_days: number;

  reason: string;

  attachments: LeaveAttachment[];

  status:
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Cancelled";

  created_at: string;
}

export interface LeaveAttachment {
  id: number;
  original_file_name: string;
  stored_file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

const hrLeaveService = {
  async getAllLeaveRequests(): Promise<HrLeaveRequest[]> {
    const response = await api.get("/leaves");

    return response.data.data;
  },

  async approveLeave(
    leaveRequestUuid: string,
    review_comment?: string
  ) {
    const response = await api.patch(
      `/leaves/${leaveRequestUuid}/approve`,
      {
        review_comment,
      }
    );

    return response.data;
  },

  async rejectLeave(
    leaveRequestUuid: string,
    review_comment?: string
  ) {
    const response = await api.patch(
      `/leaves/${leaveRequestUuid}/reject`,
      {
        review_comment,
      }
    );

    return response.data;
  },
  
  async getLeaveRequestByUuid(
  leaveRequestUuid: string
): Promise<HrLeaveRequestDetails> {

  const response = await api.get(
    `/leaves/hr/${leaveRequestUuid}`
  );

  return response.data.data;

},

async getStatistics(): Promise<LeaveStatistics> {

  const response = await api.get(
    "/leaves/statistics"
  );

  return response.data.data;

},

};

export default hrLeaveService;