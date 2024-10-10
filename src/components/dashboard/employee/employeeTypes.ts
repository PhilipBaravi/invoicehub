export interface Employee {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'Admin' | 'Manager' | 'Employee';
  dateOfEmployment: Date;
  status: 'Active' | 'Inactive';
}
