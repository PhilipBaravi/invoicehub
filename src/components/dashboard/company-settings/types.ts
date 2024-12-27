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
  id: number;
  title: string;
  phone: string;
  website: string;
  email: string;
  address: Address;
}

export interface Role {
  description: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfEmployment: string;
  enabled: boolean;
  company: Company;
  role: Role;
}
