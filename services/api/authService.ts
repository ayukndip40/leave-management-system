import api from "./axios";
import { User } from "../../types/user";

export interface LoginRequest {
  login: string;
  password: string;
}


export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  must_change_password: boolean;
  user: User;
}

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  return response.data;
};

export interface CurrentUserResponse {
  success: boolean;
  user: User;
}

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await api.get<CurrentUserResponse>("/auth/me");

  return response.data;
};