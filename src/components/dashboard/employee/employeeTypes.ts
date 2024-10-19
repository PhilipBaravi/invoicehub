export interface Address {
  id: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Company {
  title: string;
  phone: string;
  website: string;
  address: Address;
}

export interface Role {
  description: string;
}

export interface Employee {
  id: string; // should be string since the error is indicating mismatch
  username: string;
  password: string;
  confirmPassword: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfEmployment: Date; // date should be of type Date
  enabled: boolean;
  status: string | null;
  company: Company;
  role: Role;
}
