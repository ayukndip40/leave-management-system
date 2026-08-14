export interface LeaveType {
  leave_type_uuid: string;

  leave_name: string;
  description: string;

  maximum_days: number;

  paid_leave: boolean;
  requires_document: boolean;

  color: string;

  status: "active" | "inactive";

  created_at?: string;
  updated_at?: string;
}

export interface CreateLeaveTypeData {
  leave_name: string;
  description: string;

  maximum_days: number;

  paid_leave: boolean;
  requires_document: boolean;

  color: string;
}