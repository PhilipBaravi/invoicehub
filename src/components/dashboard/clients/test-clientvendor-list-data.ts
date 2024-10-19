export interface Address {
    id: number;
    addressLine1: string;
    addressLine2?: string;
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
  
  export interface ClientVendor {
    id: number;
    name: string;
    phone: string;
    website: string;
    email: string;
    clientVendorType: 'CLIENT' | 'VENDOR';
    address: Address;
    company: Company;
  }
  
  export interface ClientVendorListData {
    data: ClientVendor[];
  }
  
  const testClientVendorListData: ClientVendorListData = {
    data: [
      {
        id: 1,
        name: 'Samsung',
        phone: '0123456789',
        website: 'samsung.com',
        email: 'samsung@email.com',
        clientVendorType: 'CLIENT',
        address: {
          id: 4,
          addressLine1: 'purple street',
          addressLine2: 'purple avenue 25',
          city: 'Tbilisi',
          state: 'Tbilisi',
          country: 'Georgia',
          zipCode: '0166',
        },
        company: {
          title: 'red tech',
          phone: '345',
          website: 'redtech@email.com',
          address: {
            id: 1,
            addressLine1: 'red street',
            addressLine2: 'red avenue 23',
            city: 'Tbilisi',
            state: 'Tbilisi',
            country: 'Georgia',
            zipCode: '0163',
          },
        },
      },
      {
        id: 2,
        name: 'Apple',
        phone: '0123456789',
        website: 'apple.com',
        email: 'apple@email.com',
        clientVendorType: 'VENDOR',
        address: {
          id: 4,
          addressLine1: 'purple street',
          addressLine2: 'purple avenue 25',
          city: 'Tbilisi',
          state: 'Tbilisi',
          country: 'Georgia',
          zipCode: '0166',
        },
        company: {
          title: 'red tech',
          phone: '345',
          website: 'redtech@email.com',
          address: {
            id: 1,
            addressLine1: 'red street',
            addressLine2: 'red avenue 23',
            city: 'Tbilisi',
            state: 'Tbilisi',
            country: 'Georgia',
            zipCode: '0163',
          },
        },
      },
      {
        id: 3,
        name: 'Google',
        phone: '0123456789',
        website: 'google.com',
        email: 'google@email.com',
        clientVendorType: 'CLIENT',
        address: {
          id: 4,
          addressLine1: 'purple street',
          addressLine2: 'purple avenue 25',
          city: 'Tbilisi',
          state: 'Tbilisi',
          country: 'Georgia',
          zipCode: '0166',
        },
        company: {
          title: 'red tech',
          phone: '345',
          website: 'redtech@email.com',
          address: {
            id: 1,
            addressLine1: 'red street',
            addressLine2: 'red avenue 23',
            city: 'Tbilisi',
            state: 'Tbilisi',
            country: 'Georgia',
            zipCode: '0163',
          },
        },
      },
      {
        id: 4,
        name: 'Amazon',
        phone: '0123456789',
        website: 'amazon.com',
        email: 'amazon@email.com',
        clientVendorType: 'VENDOR',
        address: {
          id: 4,
          addressLine1: 'purple street',
          addressLine2: 'purple avenue 25',
          city: 'Tbilisi',
          state: 'Tbilisi',
          country: 'Georgia',
          zipCode: '0166',
        },
        company: {
          title: 'red tech',
          phone: '345',
          website: 'redtech@email.com',
          address: {
            id: 1,
            addressLine1: 'red street',
            addressLine2: 'red avenue 23',
            city: 'Tbilisi',
            state: 'Tbilisi',
            country: 'Georgia',
            zipCode: '0163',
          },
        },
      },
    ],
  };
  
  export default testClientVendorListData;
  