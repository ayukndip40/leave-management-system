import { UserRole } from "./role";

export interface User {
  user_uuid: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;

  role: UserRole;
  status: string;

  department_name: string;
  position_name: string;

  employment_type: string;
  employment_date: string;

  gender?: string;
  date_of_birth?: string;
  marital_status?: string;
  address?: string;
  city?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface GetUsersResponse {
  success: boolean;
  data: User[];
  pagination: Pagination;
}

export interface GetUserResponse {
  success: boolean;
  data: User;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;

  role: "admin" | "hr" | "employee";

  department_id: number;
  position_id: number;

  gender: "Male" | "Female" | "Other";

  employment_type:
    | "Permanent"
    | "Contract"
    | "Temporary"
    | "Intern";

  employment_date: string;
  date_of_birth: string;

  // Optional fields
  marital_status?: string;
  address?: string;
  city?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}