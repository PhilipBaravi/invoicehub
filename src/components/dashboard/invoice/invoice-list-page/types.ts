import { Invoice } from "../invoice-types";

export interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newInvoiceCurrency: "USD" | "EUR" | "GEL";
  setNewInvoiceCurrency: (currency: "USD" | "EUR" | "GEL") => void;
  onConfirm: () => void;
}

export interface InvoicePreviewProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}
