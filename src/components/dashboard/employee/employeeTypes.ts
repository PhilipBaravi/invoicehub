export interface Employee {
    id: string
    name: string
    email: string
    phone: string
    role: string
    department: string
    employeeId: string
    dateOfEmployment: Date
    accessPermissions: string
    status: 'Active' | 'Inactive'
  }
  