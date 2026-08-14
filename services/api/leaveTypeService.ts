import api from "./axios";
import {
  LeaveType,
  CreateLeaveTypeData,
} from "../../types/leaveType";

interface LeaveTypesResponse {
  success: boolean;
  data: LeaveType[];
}

interface LeaveTypeResponse {
  success: boolean;
  data: LeaveType;
}

interface CreateLeaveTypeResponse {
  success: boolean;
  message: string;
}

export const getLeaveTypes =
  async (): Promise<LeaveTypesResponse> => {

    const response = await api.get("/leave-types");

    return response.data;

};

export const getLeaveTypeByUuid =
  async (
    leaveTypeUuid: string
  ): Promise<LeaveTypeResponse> => {

    const response = await api.get(
      `/leave-types/${leaveTypeUuid}`
    );

    return response.data;

};

export const createLeaveType =
  async (
    leaveType: CreateLeaveTypeData
  ): Promise<CreateLeaveTypeResponse> => {

    const response = await api.post(
      "/leave-types",
      leaveType
    );

    return response.data;

};