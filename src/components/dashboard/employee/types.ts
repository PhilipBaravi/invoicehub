export interface Employee {
  id: string;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: { description: "Admin" | "Manager" | "Employee" };
  dateOfEmployment: Date;
  status: "ACTIVE" | "INACTIVE";
}

export type EmployeeErrors = {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};
