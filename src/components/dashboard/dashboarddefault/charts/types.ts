export type FinancialSummary = {
  name: string;
  value: number;
};

export type QuantitiesSummary = {
  name: string;
  value: number;
};

export type ChartDataItem = {
  year: number;
  month: number;
  dayOfMonth: number;
  quantity: number;
  amount: number;
  currency: string;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  code: number;
  data: ChartDataItem[];
};

export type YearMonthCurrencySelectProps = {
  id: string;
  year: number;
  startMonth: number;
  endMonth: number;
  currency: string;
  onYearChange: (year: number) => void;
  onStartMonthChange: (month: number) => void;
  onEndMonthChange: (month: number) => void;
  onCurrencyChange: (currency: string) => void;
  showTotal?: boolean;
  onShowTotalChange?: (showTotal: boolean) => void;
};

export type SavedPreferences = {
  year: number;
  startMonth: number;
  endMonth: number;
  currency: string;
  showTotal?: boolean;
};

export interface ExchangeRate {
  code: string;
  rate: number;
  icon: React.ReactNode;
}

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

export interface ClientVendor {
  id: number;
  name: string;
  phone: string;
  website: string;
  email: string;
  clientVendorType: string;
  address: Address;
}

export interface Invoice {
  id: number;
  invoiceNo: string;
  invoiceStatus: string;
  invoiceType: string;
  dateOfIssue: string;
  dueDate: string;
  acceptDate: string;
  paymentTerms: string;
  notes: string;
  company: Company;
  clientVendor: ClientVendor;
  price: number;
  currency: string;
  tax: number;
  total: number;
}

export interface SummaryResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_products_sold: number;
    total_employees: number;
    total_products: number;
    total_clients: number;
  };
}

export interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: string;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export type Product = {
  name: string;
  quantity: number;
  amount: number;
  currency: string;
};
