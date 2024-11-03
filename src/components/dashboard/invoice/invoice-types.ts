

export type InvoiceStatus = "AWAITING_APPROVAL" | "APPROVED" | "REJECTED" | "PAID";
export type InvoiceType = "SALES" | "PURCHASE";

export interface Address {
  id: number;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface ClientVendor {
  id: number;
  name: string;
  phone: string;
  website: string;
  email: string;
  clientVendorType: "CLIENT" | "VENDOR"; // Updated to be more specific
  address: Address;
}

export interface BusinessInfo {
  id: number;
  title: string;
  phone: string;
  website: string;
  email: string;
  address: Address;
}

export interface Category {
  id: number;
  description: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  quantityInStock: number;
  lowLimitAlert: number;
  price: number;
  createdAt: string;
  productUnit: string;
  status: string;
  category: Category;
}

export interface Invoice {
  id: number;
  invoiceNo: string;
  invoiceStatus: InvoiceStatus;
  invoiceType: InvoiceType;
  dateOfIssue: Date; // Change from string to Date
  dueDate: Date;      // Change from string to Date
  paymentTerms: string;
  notes: string;
  clientVendor: ClientVendor;
  price: number;
  tax: number;
  total: number;
}


export interface InvoiceCreateRequest {
  invoiceNo: string;
  dateOfIssue: string;
  dueDate: string;
  paymentTerms: string;
  notes: string;
  clientVendorId: number;
  lineItems: LineItemCreateRequest[];
  price: number;
  tax: number;
  total: number;
}

export interface LineItemCreateRequest {
  itemId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  tax: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: number;
  data: T;
}
