"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function GeneratedInvoicesHistory() {
  const [invoices, setInvoices] = useState<any[]>([])

  // Load saved invoices from localStorage when the component mounts
  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoices")
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices))
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem("invoices")
    setInvoices([])
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Generated Invoices History</h2>
      {invoices.length > 0 ? (
        <div className="space-y-4">
          {invoices.map((invoice, index) => (
            <div key={index} className="p-4 bg-gray-100 dark:bg-stone-800 rounded-md">
              <h3 className="text-lg font-semibold">Invoice {invoice.invoiceNumber}</h3>
              <p><strong>Seller:</strong> {invoice.sellerName}</p>
              <p><strong>Buyer:</strong> {invoice.buyerName}</p>
              <p><strong>Total Amount:</strong> {invoice.totalAmount}</p>
              <p><strong>Issue Date:</strong> {invoice.issueDate}</p>
              <p><strong>Due Date:</strong> {invoice.dueDate}</p>
              <a href={invoice.pdfUrl} download={`Invoice_${invoice.invoiceNumber}.pdf`}>
                <Button>Download PDF</Button>
              </a>
            </div>
          ))}
          <Button variant="destructive" onClick={clearHistory}>
            Clear History
          </Button>
        </div>
      ) : (
        <p>No invoices generated yet.</p>
      )}
    </div>
  )
}
