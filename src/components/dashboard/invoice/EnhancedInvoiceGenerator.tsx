import { FC, useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { InvoiceData, Invoice } from "./invoicetypes";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import InvoiceHistory from "./InvoiceHistory";
import { v4 as uuidv4 } from "uuid"; 

const EnhancedInvoiceGenerator: FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    sellerName: "",
    sellerAddress: "",
    sellerContact: "",
    sellerEmail: "",
    sellerTIN: "",
    buyerName: "",
    buyerAddress: "",
    buyerContact: "",
    buyerEmail: "",
    buyerTIN: "",
    items: [{ description: "", quantity: "", unitPrice: "", total: "" }],
    subtotal: "",
    taxType: "VAT",
    taxRate: "18",
    taxAmount: "",
    discountDescription: "",
    discountAmount: "",
    totalAmount: "",
    paymentMethods: "",
    paymentInstructions: "",
    lateFee: "",
    notes: "",
    termsConditions: "",
    pdfUrl: "",
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: "", unitPrice: "", total: "" },
      ],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  const saveInvoice = (invoice: InvoiceData) => {
    const existingInvoices = JSON.parse(
      localStorage.getItem("invoices") || "[]"
    );

    const newInvoice: Invoice = {
      id: uuidv4(), // Generate a unique ID
      invoiceNumber: invoice.invoiceNumber,
      sellerName: invoice.sellerName,
      buyerName: invoice.buyerName,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      amount: parseFloat(invoice.totalAmount) || 0,
      pdfUrl: invoice.pdfUrl,
    };

    const updatedInvoices = [...existingInvoices, newInvoice];
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
  };

  const handlePrint = useReactToPrint({
    contentRef,
    onAfterPrint: () => {
      const blob = new Blob([contentRef.current!.innerHTML], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(blob);

      saveInvoice({ ...invoiceData, pdfUrl });

      alert("Invoice saved to history!");
    },
  });

  type ExtendedViewMode = "form" | "preview" | "history";
  const [viewMode, setViewMode] = useState<ExtendedViewMode>("form");

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <div className="mb-6 flex justify-between items-center space-x-4">
        <div className="flex gap-[20px]">
          <Button
            onClick={() => setViewMode("form")}
            variant={viewMode === "form" ? "default" : "outline"}
          >
            Fill Form
          </Button>
          <Button
            onClick={() => setViewMode("preview")}
            variant={viewMode === "preview" ? "default" : "outline"}
          >
            Preview
          </Button>
          <Button
            onClick={() => setViewMode("history")}
            variant={viewMode === "history" ? "default" : "outline"}
          >
            Invoice History
          </Button>
        </div>
        {viewMode !== "history" && (
          <Button onClick={() => handlePrint()}>Generate PDF</Button>
        )}
      </div>

      {viewMode !== "history" && (
        <div className="hidden">
          <div ref={contentRef}>
            <InvoicePreview
              invoiceData={invoiceData}
              contentRef={contentRef}
            />
          </div>
        </div>
      )}

      {viewMode === "history" ? (
        <InvoiceHistory invoices={invoices} setInvoices={setInvoices} />
      ) : (
        <div className="flex-grow">
          {viewMode === "form" ? (
            <InvoiceForm
              invoiceData={invoiceData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleItemChange={handleItemChange}
              addItem={addItem}
              removeItem={removeItem}
            />
          ) : (
            <InvoicePreview
              invoiceData={invoiceData}
              contentRef={contentRef}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default EnhancedInvoiceGenerator