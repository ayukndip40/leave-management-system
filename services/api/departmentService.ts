import api from "./axios";

export interface Department {
  id: number;
  department_name: string;
}

export interface GetDepartmentsResponse {
  success: boolean;
  data: Department[];
}

export const getDepartments = async (): Promise<GetDepartmentsResponse> => {
  const response = await api.get<GetDepartmentsResponse>("/departments");

    return response.data;
};