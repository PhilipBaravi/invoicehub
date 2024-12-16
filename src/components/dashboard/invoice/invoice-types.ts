// Invoice status and type enums
export type InvoiceStatus = 'AWAITING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PAID';
export type InvoiceTypeType = 'SALES' | 'PURCHASE';

// Address interface
export interface Address {
  id?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  [key: string]: any;
}

// ClientVendor interface
export interface ClientVendor {
  id: number;
  name: string;
  phone: string;
  website: string;
  email: string;
  clientVendorType: 'CLIENT' | 'VENDOR';
  address: Address;
}

// BusinessInfo interface
export interface BusinessInfo {
  id?: number;
  title: string;
  phone: string;
  website: string;
  email: string;
  address: Address;
}

// Category interface
export interface Category {
  id: number;
  description: string;
  icon: string;
}

// Product interface
export interface Product {
  id: number;
  name: string;
  description?: string;
  quantityInStock: number;
  lowLimitAlert: number;
  price: number;
  currency: string; // added currency field
  createdAt: string;
  productUnit: string;
  status: string;
  category: Category;
}

// Invoice Product interface
export interface InvoiceProduct {
  id: number;
  quantity: number;
  price: number;
  tax: number;
  total: number;
  profitLoss: number;
  remainingQuantity: number;
  invoice: Invoice;
  product: Product;
}

// Invoice interface
export interface Invoice {
  currency: string;
  id: number;
  invoiceNo: string;
  invoiceStatus: InvoiceStatus;
  invoiceType: InvoiceTypeType;
  dateOfIssue: Date | null;
  dueDate: Date | null;
  paymentTerms: string;
  notes: string;
  terms?: string;
  clientVendor: ClientVendor | null;
  price: number;
  tax: number;
  total: number;
  businessSignature?: string;
  clientSignature?: string;
}

// LineItem interface
export interface LineItem {
  itemId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  tax: number;
  maxQuantity?: number; // Optional, used for validation in components
  error?: string; // Optional, used for validation in components
}
