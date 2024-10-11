"use client"

import React, { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import GeneratedInvoicesHistory from "./GeneratedInvoicesHistory"

type ViewMode = "form" | "preview" | "pdf"

export default function EnhancedInvoiceGenerator() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("form")
  const [invoiceData, setInvoiceData] = useState({
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
    pdfUrl: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInvoiceData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...invoiceData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setInvoiceData((prev) => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: "", unitPrice: "", total: "" }],
    }))
  }

  const removeItem = (index: number) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index)
    setInvoiceData((prev) => ({ ...prev, items: newItems }))
  }

  const saveInvoice = (invoice: typeof invoiceData) => {
    const existingInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const updatedInvoices = [...existingInvoices, invoice]
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
  }

  const handlePrint = useReactToPrint({
    contentRef,
    onAfterPrint: () => {
      const blob = new Blob([contentRef.current!.innerHTML], { type: "application/pdf" })
      const pdfUrl = URL.createObjectURL(blob)
  
      // Save the entire invoice object including the pdfUrl
      saveInvoice({ ...invoiceData, pdfUrl })
      
      alert("Invoice saved to history!")
    },
  })
  
  const renderForm = () => (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            name="issueDate"
            type="date"
            value={invoiceData.issueDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={invoiceData.dueDate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Seller Information</h3>
          <Input
            placeholder="Company Name"
            name="sellerName"
            value={invoiceData.sellerName}
            onChange={handleInputChange}
          />
          <Textarea
            placeholder="Company Address"
            name="sellerAddress"
            value={invoiceData.sellerAddress}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Contact Number"
            name="sellerContact"
            value={invoiceData.sellerContact}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Email"
            name="sellerEmail"
            type="email"
            value={invoiceData.sellerEmail}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Tax Identification Number (TIN)"
            name="sellerTIN"
            value={invoiceData.sellerTIN}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Buyer Information</h3>
          <Input
            placeholder="Customer Name / Company Name"
            name="buyerName"
            value={invoiceData.buyerName}
            onChange={handleInputChange}
          />
          <Textarea
            placeholder="Address"
            name="buyerAddress"
            value={invoiceData.buyerAddress}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Contact Number"
            name="buyerContact"
            value={invoiceData.buyerContact}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Email"
            name="buyerEmail"
            type="email"
            value={invoiceData.buyerEmail}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Tax Identification Number (TIN)"
            name="buyerTIN"
            value={invoiceData.buyerTIN}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-lg mb-4">Items</h3>
        {invoiceData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 mb-4">
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, "description", e.target.value)}
            />
            <Input
              placeholder="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
            />
            <Input
              placeholder="Unit Price"
              type="number"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
            />
            <Input
              placeholder="Total"
              type="number"
              value={item.total}
              onChange={(e) => handleItemChange(index, "total", e.target.value)}
            />
            <Button type="button" variant="destructive" onClick={() => removeItem(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addItem} className="mt-2">
          Add Item
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="subtotal">Subtotal</Label>
          <Input
            id="subtotal"
            name="subtotal"
            type="number"
            value={invoiceData.subtotal}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="taxType">Tax Type</Label>
          <Select onValueChange={(value) => handleSelectChange("taxType", value)} value={invoiceData.taxType}>
            <SelectTrigger>
              <SelectValue placeholder="Select tax type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VAT">VAT</SelectItem>
              <SelectItem value="Sales Tax">Sales Tax</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            name="taxRate"
            type="number"
            value={invoiceData.taxRate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="taxAmount">Tax Amount</Label>
          <Input
            id="taxAmount"
            name="taxAmount"
            type="number"
            value={invoiceData.taxAmount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="discountDescription">Discount Description</Label>
          <Input
            id="discountDescription"
            name="discountDescription"
            value={invoiceData.discountDescription}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="discountAmount">Discount Amount</Label>
          <Input
            id="discountAmount"
            name="discountAmount"
            type="number"
            value={invoiceData.discountAmount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="totalAmount">Total Amount Due</Label>
          <Input
            id="totalAmount"
            name="totalAmount"
            type="number"
            value={invoiceData.totalAmount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="paymentMethods">Payment Methods</Label>
          <Input
            id="paymentMethods"
            name="paymentMethods"
            value={invoiceData.paymentMethods}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="paymentInstructions">Payment Instructions</Label>
          <Textarea
            id="paymentInstructions"
            name="paymentInstructions"
            value={invoiceData.paymentInstructions}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="lateFee">Late Fee Policy</Label>
          <Input
            id="lateFee"
            name="lateFee"
            value={invoiceData.lateFee}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={invoiceData.notes}
            onChange={handleInputChange}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="termsConditions">Terms and Conditions</Label>
          <Textarea
            id="termsConditions"
            name="termsConditions"
            value={invoiceData.termsConditions}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </form>
  )

  const renderInvoice = () => (
    <div className="p-10 bg-white dark:bg-stone-950" ref={contentRef}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="w-32 h-32 bg-gray-200 dark:bg-stone-800 flex items-center justify-center text-gray-500 dark:text-stone-400">
            Logo
          </div>
          <h2 className="text-2xl font-bold mt-4 text-stone-950 dark:text-stone-50">
            {invoiceData.sellerName}
          </h2>
          <p className="text-stone-700 dark:text-stone-300">{invoiceData.sellerAddress}</p>
          <p className="text-stone-700 dark:text-stone-300">TIN: {invoiceData.sellerTIN}</p>
          <p className="text-stone-700 dark:text-stone-300">{invoiceData.sellerContact}</p>
          <p className="text-stone-700 dark:text-stone-300">{invoiceData.sellerEmail}</p>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold mb-4 text-stone-950 dark:text-stone-50">INVOICE</h1>
          <p className="text-stone-700 dark:text-stone-300">
            <strong>Invoice Number:</strong> {invoiceData.invoiceNumber}
          </p>
          <p className="text-stone-700 dark:text-stone-300">
            <strong>Issue Date:</strong> {invoiceData.issueDate}
          </p>
          <p className="text-stone-700 dark:text-stone-300">
            <strong>Due Date:</strong> {invoiceData.dueDate}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-stone-950 dark:text-stone-50">Bill To:</h3>
        <p className="text-stone-700 dark:text-stone-300">{invoiceData.buyerName}</p>
        <p className="text-stone-700 dark:text-stone-300">{invoiceData.buyerAddress}</p>
        <p className="text-stone-700 dark:text-stone-300">TIN: {invoiceData.buyerTIN}</p>
        <p className="text-stone-700 dark:text-stone-300">{invoiceData.buyerContact}</p>
        <p className="text-stone-700 dark:text-stone-300">{invoiceData.buyerEmail}</p>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-100 dark:bg-stone-800">
            <th className="p-2 text-left text-stone-950 dark:text-stone-50">Description</th>
            <th className="p-2 text-right text-stone-950 dark:text-stone-50">Quantity</th>
            <th className="p-2 text-right text-stone-950 dark:text-stone-50">Unit Price</th>
            <th className="p-2 text-right text-stone-950 dark:text-stone-50">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index} className="border-b border-stone-300 dark:border-stone-700">
              <td className="p-2 text-stone-700 dark:text-stone-300">{item.description}</td>
              <td className="p-2 text-right text-stone-700 dark:text-stone-300">{item.quantity}</td>
              <td className="p-2 text-right text-stone-700 dark:text-stone-300">{item.unitPrice}</td>
              <td className="p-2 text-right text-stone-700 dark:text-stone-300">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-1/2">
          <div className="flex justify-between mb-2">
            <span className="text-stone-700 dark:text-stone-300">Subtotal:</span>
            <span className="text-stone-700 dark:text-stone-300">{invoiceData.subtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-stone-700 dark:text-stone-300">
              {invoiceData.taxType} ({invoiceData.taxRate}%):
            </span>
            <span className="text-stone-700 dark:text-stone-300">{invoiceData.taxAmount}</span>
          </div>
          {invoiceData.discountDescription && (
            <div className="flex justify-between mb-2">
              <span className="text-stone-700 dark:text-stone-300">
                Discount ({invoiceData.discountDescription}):
              </span>
              <span className="text-stone-700 dark:text-stone-300">-{invoiceData.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span className="text-stone-950 dark:text-stone-50">Total Amount Due:</span>
            <span className="text-stone-950 dark:text-stone-50">{invoiceData.totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-stone-950 dark:text-stone-50">Payment Details:</h3>
        <p className="text-stone-700 dark:text-stone-300">
          <strong>Accepted Methods:</strong> {invoiceData.paymentMethods}
        </p>
        <p className="text-stone-700 dark:text-stone-300">
          <strong>Instructions:</strong> {invoiceData.paymentInstructions}
        </p>
        <p className="text-stone-700 dark:text-stone-300">
          <strong>Late Fee Policy:</strong> {invoiceData.lateFee}
        </p>
      </div>

      {invoiceData.notes && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2 text-stone-950 dark:text-stone-50">Additional Notes:</h3>
          <p className="text-stone-700 dark:text-stone-300">{invoiceData.notes}</p>
        </div>
      )}

      {invoiceData.termsConditions && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2 text-stone-950 dark:text-stone-50">Terms and Conditions:</h3>
          <p className="text-stone-700 dark:text-stone-300">{invoiceData.termsConditions}</p>
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-stone-300 dark:border-stone-700">
        <div className="flex justify-between">
          <div>
            <p className="font-bold text-stone-950 dark:text-stone-50">Authorized Signature</p>
            <div className="mt-8 border-t border-gray-400 dark:border-stone-700 w-48"></div>
          </div>
          <div>
            <p className="font-bold text-stone-950 dark:text-stone-50">Company Stamp</p>
            <div className="mt-8 border-2 border-gray-400 dark:border-stone-700 w-32 h-32"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <div className="mb-6 flex justify-between items-center space-x-4">
        <div className="flex gap-[20px]">
          <Button onClick={() => setViewMode("form")} variant={viewMode === "form" ? "default" : "outline"}>
            Fill Form
          </Button>
          <Button onClick={() => setViewMode("preview")} variant={viewMode === "preview" ? "default" : "outline"}>
            Preview
          </Button>
        </div>
        <Button onClick={() => handlePrint()}>Generate PDF</Button>
      </div>

      <Card className="flex-grow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {viewMode === "form" ? "Invoice Generator" : "Invoice Preview"}
          </CardTitle>
        </CardHeader>
        <CardContent>{viewMode === "form" ? renderForm() : renderInvoice()}</CardContent>
      </Card>

      <div className="hidden">
        <div ref={contentRef}>{renderInvoice()}</div>
      </div>
      <GeneratedInvoicesHistory />
    </div>
  )
}
