import api from "./axios";
import { GetUsersResponse } from "../../types/user";
import { GetUserResponse } from "../../types/user";
import { CreateUserRequest } from "../../types/user";

export const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await api.get<GetUsersResponse>("/users");

  return response.data;
};

export const getUserByUuid = async (
  userUuid: string
): Promise<GetUserResponse> => {
  const response = await api.get<GetUserResponse>(
    `/users/${userUuid}`
  );

  return response.data;
};

export interface CreateUserResponse {
  success: boolean;
  message: string;
  employee_number: string;
  temporary_password: string;
}

export const createUser = async (
  data: CreateUserRequest
): Promise<CreateUserResponse> => {
  const response = await api.post<CreateUserResponse>(
    "/users",
    data
  );

  return response.data;
};

export interface UpdateEmployeeProfileData {
  marital_status: string;
  address: string;
  city: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

export const updateEmployeeProfile = async (
  data: UpdateEmployeeProfileData
) => {
  const response = await api.put(
    "/users/profile",
    data
  );

  return response.data;
};