export type ViewMode = "form" | "preview" | "pdf";

export type InvoiceItem = {
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
};

export type InvoiceData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  sellerName: string;
  sellerAddress: string;
  sellerContact: string;
  sellerEmail: string;
  sellerTIN: string;
  buyerName: string;
  buyerAddress: string;
  buyerContact: string;
  buyerEmail: string;
  buyerTIN: string;
  items: InvoiceItem[];
  subtotal: string;
  taxType: string;
  taxRate: string;
  taxAmount: string;
  discountDescription: string;
  discountAmount: string;
  totalAmount: string;
  paymentMethods: string;
  paymentInstructions: string;
  lateFee: string;
  notes: string;
  termsConditions: string;
  pdfUrl: string;
};

export interface Invoice {
  id: string;
  invoiceNumber: string;
  sellerName: string;
  buyerName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  pdfUrl: string;
}
