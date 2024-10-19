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
  
  export interface User {
    id: number; // This remains a number in the test data
    username: string;
    password: string;
    confirmPassword: string | null;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfEmployment: string; // We keep this as a string in test data
    enabled: boolean;
    status: string | null;
    company: Company;
    role: Role;
  }
  
  export interface UserListData {
    data: User[];
  }
  
  // Sample test data
  const testUserListData: UserListData = {
    data: [
      {
        id: 1,
        username: "haroldfinch@email.com",
        password: "Abc1",
        confirmPassword: null,
        firstName: "Harold",
        lastName: "Finch",
        phone: "0123456789",
        dateOfEmployment: "2022-01-05", // String for now, we'll convert this to Date in the component
        enabled: true,
        status: null,
        company: {
          title: "red tech",
          phone: "345",
          website: "redtech@email.com",
          address: {
            id: 1,
            addressLine1: "red street",
            addressLine2: "red avenue 23",
            city: "Tbilisi",
            state: "Tbilisi",
            country: "Georgia",
            zipCode: "0163",
          },
        },
        role: {
          description: "Admin",
        },
      },
      {
        id: 3,
        username: "lionelfusco@email.com",
        password: "Abc1",
        confirmPassword: null,
        firstName: "Lionel",
        lastName: "Fusco",
        phone: "0987612345",
        dateOfEmployment: "2022-01-05",
        enabled: true,
        status: null,
        company: {
          title: "red tech",
          phone: "345",
          website: "redtech@email.com",
          address: {
            id: 1,
            addressLine1: "red street",
            addressLine2: "red avenue 23",
            city: "Tbilisi",
            state: "Tbilisi",
            country: "Georgia",
            zipCode: "0163",
          },
        },
        role: {
          description: "Employee",
        },
      },
      {
        id: 11,
        username: "teresalisbon@email.com",
        password: "Abc1",
        confirmPassword: null,
        firstName: "Teresa",
        lastName: "Lisbon",
        phone: "5674019283",
        dateOfEmployment: "2022-01-05",
        enabled: true,
        status: null,
        company: {
          title: "red tech",
          phone: "345",
          website: "redtech@email.com",
          address: {
            id: 1,
            addressLine1: "red street",
            addressLine2: "red avenue 23",
            city: "Tbilisi",
            state: "Tbilisi",
            country: "Georgia",
            zipCode: "0163",
          },
        },
        role: {
          description: "Admin",
        },
      },
      {
        id: 15,
        username: "michellevega@email.com",
        password: "Abc1",
        confirmPassword: null,
        firstName: "Michelle",
        lastName: "Vega",
        phone: "0912537648",
        dateOfEmployment: "2022-01-05",
        enabled: true,
        status: null,
        company: {
          title: "red tech",
          phone: "345",
          website: "redtech@email.com",
          address: {
            id: 1,
            addressLine1: "red street",
            addressLine2: "red avenue 23",
            city: "Tbilisi",
            state: "Tbilisi",
            country: "Georgia",
            zipCode: "0163",
          },
        },
        role: {
          description: "Employee",
        },
      },
      {
        id: 16,
        username: "kimfischer@email.com",
        password: "Abc1",
        confirmPassword: null,
        firstName: "Kim",
        lastName: "Fischer",
        phone: "1209786345",
        dateOfEmployment: "2022-01-05",
        enabled: true,
        status: null,
        company: {
          title: "red tech",
          phone: "345",
          website: "redtech@email.com",
          address: {
            id: 1,
            addressLine1: "red street",
            addressLine2: "red avenue 23",
            city: "Tbilisi",
            state: "Tbilisi",
            country: "Georgia",
            zipCode: "0163",
          },
        },
        role: {
          description: "Manager",
        },
      },
    ],
  };
  
  export default testUserListData;
  