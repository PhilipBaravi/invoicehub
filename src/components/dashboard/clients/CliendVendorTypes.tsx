export interface Address {
    id: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }
  
  export interface ClientVendor {
    id: string;
    name: string;
    phone: string;
    website: string;
    email: string;
    clientVendorType: 'CLIENT' | 'VENDOR';
    address: Address;
  }