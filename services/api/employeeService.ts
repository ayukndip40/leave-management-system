import api from "./axios";

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

const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    const response = await api.get("/users");
    console.log(response.data);

    return response.data.data;
  },

  async getEmployeeByUuid(
    userUuid: string
  ): Promise<Employee> {
    const response = await api.get(
      `/users/${userUuid}`
    );

    return response.data.data;
  },
};

export default employeeService;