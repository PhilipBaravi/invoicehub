interface Address {
    id: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }
  
  interface ClientVendor {
    id: number;
    name: string;
    phone: string;
    website: string;
    email: string;
    clientVendorType: "CLIENT" | "VENDOR";
    address: Address;
  }
  
  interface Invoice {
    id: number;
    invoiceNo: string;
    invoiceStatus: "AWAITING_APPROVAL" | "APPROVED" | "REJECTED" | "PAID";
    invoiceType: "SALES" | "PURCHASE";
    dateOfIssue: Date;
    dueDate: Date;
    paymentTerms: string;
    notes: string;
    clientVendor: ClientVendor;
    price: number;
    tax: number;
    total: number;
  }
  
  const testInvoiceListData: Invoice[] = [
    {
      id: 1,
      invoiceNo: "INV001",
      invoiceStatus: "AWAITING_APPROVAL",
      invoiceType: "SALES",
      dateOfIssue: new Date("2024-10-23"),
      dueDate: new Date("2024-11-23"),
      paymentTerms: "terms",
      notes: "notes",
      clientVendor: {
        id: 1,
        name: "Samsung",
        phone: "0123456789",
        website: "samsung.com",
        email: "samsung@email.com",
        clientVendorType: "CLIENT",
        address: {
          id: 4,
          addressLine1: "purple street",
          addressLine2: "purple avenue 25",
          city: "Tbilisi",
          state: "Tbilisi",
          country: "Georgia",
          zipCode: "0166"
        }
      },
      price: 400.0,
      tax: 40.0,
      total: 440.0
    },
    {
      id: 2,
      invoiceNo: "INV002",
      invoiceStatus: "APPROVED",
      invoiceType: "PURCHASE",
      dateOfIssue: new Date("2024-10-23"),
      dueDate: new Date("2024-07-23"),
      paymentTerms: "terms",
      notes: "notes",
      clientVendor: {
        id: 1,
        name: "Samsung",
        phone: "0123456789",
        website: "samsung.com",
        email: "samsung@email.com",
        clientVendorType: "CLIENT",
        address: {
          id: 4,
          addressLine1: "purple street",
          addressLine2: "purple avenue 25",
          city: "Tbilisi",
          state: "Tbilisi",
          country: "Georgia",
          zipCode: "0166"
        }
      },
      price: 0,
      tax: 0,
      total: 0
    },
    // Repeat for other invoices
  ];
  
  export default testInvoiceListData