export interface Employee {
  user_uuid: string;

  employee_number: string;

  first_name: string;
  last_name: string;

  email: string;
  phone: string | null;

  department_name: string;
  position_name: string;

  role: string;
  status: string;

  employment_type?: string;
  employment_date?: string;
}