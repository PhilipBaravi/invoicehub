import { useState } from "react";
import { Download, FileText, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "./invoicetypes";

interface InvoiceHistoryProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

export default function InvoiceHistory({
  invoices,
  setInvoices,
}: InvoiceHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter((invoice) =>
    Object.values(invoice).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const deleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
  };

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center text-stone-950 dark:text-stone-50">
          <FileText className="mr-2 h-8 w-8" />
          Invoice History
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500 dark:text-stone-400" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {invoices.length > 0 ? (
        <>
          <div className="bg-white dark:bg-stone-950 rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-stone-800">
                  <TableHead className="w-[100px] text-stone-950 dark:text-stone-50">
                    Invoice #
                  </TableHead>
                  <TableHead className="text-stone-950 dark:text-stone-50">
                    Seller
                  </TableHead>
                  <TableHead className="text-stone-950 dark:text-stone-50">
                    Buyer
                  </TableHead>
                  <TableHead className="text-stone-950 dark:text-stone-50">
                    Issue Date
                  </TableHead>
                  <TableHead className="text-stone-950 dark:text-stone-50">
                    Due Date
                  </TableHead>
                  <TableHead className="text-right text-stone-950 dark:text-stone-50">
                    Amount
                  </TableHead>
                  <TableHead className="w-[150px] text-right text-stone-950 dark:text-stone-50">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="border-b border-stone-300 dark:border-stone-700"
                  >
                    <TableCell className="font-medium text-stone-700 dark:text-stone-300">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-stone-700 dark:text-stone-300">
                      {invoice.sellerName}
                    </TableCell>
                    <TableCell className="text-stone-700 dark:text-stone-300">
                      {invoice.buyerName}
                    </TableCell>
                    <TableCell className="text-stone-700 dark:text-stone-300">
                      {invoice.issueDate}
                    </TableCell>
                    <TableCell className="text-stone-700 dark:text-stone-300">
                      {invoice.dueDate}
                    </TableCell>
                    <TableCell className="text-right text-stone-700 dark:text-stone-300">
                      $
                      {invoice.amount
                        ? invoice.amount.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="text-right flex space-x-2">
                      <a
                        href={invoice.pdfUrl}
                        download={`Invoice_${invoice.invoiceNumber}.pdf`}
                      >
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </a>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteInvoice(invoice.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <p className="text-stone-950 dark:text-stone-50">
          No invoices generated yet.
        </p>
      )}
    </div>
  );
}
