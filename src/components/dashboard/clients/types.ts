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
  clientVendorType: "CLIENT" | "VENDOR";
  address: Address;
  company?: Company;
}

export interface ClientVendorTableProps {
  paginatedClientVendors: ClientVendor[];
  selectedClientVendors: string[];
  handleSelectClientVendor: (id: string) => void;
  handleSelectAll: () => void;
  deleteClientVendor: (id: number) => void;
  setEditingClientVendor: (clientVendor: ClientVendor) => void;
  setIsEditClientVendorOpen: (open: boolean) => void;
  filteredClientVendors: ClientVendor[];
}
