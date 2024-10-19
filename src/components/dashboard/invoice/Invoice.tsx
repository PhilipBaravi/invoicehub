"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, PlusCircle, Trash2, Paperclip, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import AddClientVendorSheet from "../clients/AddClientVendorSheet"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import JSZip from "jszip"
import { ClientVendor } from "../clients/CliendVendorTypes"

type InvoiceItem = {
  id: number
  name: string
  description: string
  rate: number
  qty: number
  taxes: Tax[]
}

type Tax = {
  rate: number
  name: string
  number: string
}

type Client = {
  id: number
  name: string
  email: string
}

type BusinessInfo = {
  name: string
  phone: string
  country: string
  address1: string
  address2: string
  town: string
  state: string
  postalCode: string
  taxName: string
  taxNumber: string
  showPhone: boolean
  showAddress: boolean
  showTax: boolean
}

export default function InvoiceCreator() {
  const [isAddClientVendorOpen, setIsAddClientVendorOpen] = useState(false);
  const [logo, setLogo] = useState<string | null>(null)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "Saliz",
    phone: "+34664587841",
    country: "Spain",
    address1: "",
    address2: "",
    town: "",
    state: "",
    postalCode: "",
    taxName: "",
    taxNumber: "",
    showPhone: true,
    showAddress: true,
    showTax: true,
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const attachmentInputRef = useRef<HTMLInputElement>(null)
  const invoiceRef = useRef<HTMLDivElement>(null)

  
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setLogo(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", description: "", rate: 0, qty: 1, taxes: [] }])
  }

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: field === "rate" || field === "qty" ? Number(value) : value } : item
      )
    )
  }

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const addTaxToItem = (itemId: number, tax: Tax) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, taxes: [...item.taxes, tax] } : item))
    )
  }

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.rate * item.qty, 0)
  }

  const calculateTaxTotal = () => {
    return items.reduce((total, item) => {
      const itemTotal = item.rate * item.qty
      return total + item.taxes.reduce((taxTotal, tax) => taxTotal + (itemTotal * tax.rate) / 100, 0)
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxTotal()
  }

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setAttachments([...attachments, ...Array.from(files)])
    }
  }

  const deleteAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return

    const canvas = await html2canvas(invoiceRef.current)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

    const zip = new JSZip()
    zip.file("invoice.pdf", pdf.output("blob"))
    attachments.forEach((file) => {
      zip.file(file.name, file)
    })
    const content = await zip.generateAsync({ type: "blob" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(content)
    link.download = "invoice_with_attachments.zip"
    link.click()
  }

  const BusinessInfoDialog = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [localBusinessInfo, setLocalBusinessInfo] = useState<BusinessInfo>(businessInfo)

    const handleApplyChanges = () => {
      setBusinessInfo(localBusinessInfo)
      setIsOpen(false)
    }

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-blue-500 p-0">
            Edit Business Information
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Business Information</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={localBusinessInfo.name}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={localBusinessInfo.phone}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, phone: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showPhone"
                checked={localBusinessInfo.showPhone}
                onCheckedChange={(checked) => setLocalBusinessInfo({ ...localBusinessInfo, showPhone: checked as boolean })}
              />
              <Label htmlFor="showPhone">Show phone number</Label>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={localBusinessInfo.country}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, country: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address1">Address Line 1</Label>
              <Input
                id="address1"
                value={localBusinessInfo.address1}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, address1: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={localBusinessInfo.address2}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, address2: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="town">Town/City</Label>
              <Input
                id="town"
                value={localBusinessInfo.town}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, town: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={localBusinessInfo.state}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, state: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={localBusinessInfo.postalCode}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, postalCode: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showAddress"
                checked={localBusinessInfo.showAddress}
                onCheckedChange={(checked) => setLocalBusinessInfo({ ...localBusinessInfo, showAddress: checked as boolean })}
              />
              <Label htmlFor="showAddress">Show address</Label>
            </div>
            <div>
              <Label htmlFor="taxName">Tax Name</Label>
              <Input
                id="taxName"
                value={localBusinessInfo.taxName}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, taxName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="taxNumber">Tax Number</Label>
              <Input
                id="taxNumber"
                value={localBusinessInfo.taxNumber}
                onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, taxNumber: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showTax"
                checked={localBusinessInfo.showTax}
                onCheckedChange={(checked) => setLocalBusinessInfo({ ...localBusinessInfo, showTax: checked as boolean })}
              />
              <Label htmlFor="showTax">Show tax information</Label>
            </div>
            <Button type="submit" onClick={handleApplyChanges}>
              Apply Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  const AddTaxDialog = ({ itemId }: { itemId: number }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [tax, setTax] = useState<Tax>({ rate: 0, name: "", number: "" })

    const handleAddTax = () => {
      addTaxToItem(itemId, tax)
      setTax({ rate: 0, name: "", number: "" })
      setIsOpen(false)
    }

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-blue-500 p-0">
            Add Taxes
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Taxes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="taxRate">Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={tax.rate}
                onChange={(e) => setTax({ ...tax, rate: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="taxName">Tax Name</Label>
              <Input
                id="taxName"
                value={tax.name}
                onChange={(e) => setTax({ ...tax, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="taxNumber">Tax Number (Optional)</Label>
              <Input
                id="taxNumber"
                value={tax.number}
                onChange={(e) => setTax({ ...tax, number: e.target.value })}
              />
            </div>
            <Checkbox id="applyToAll"  />
            <Button onClick={handleAddTax}>Apply Taxes</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end space-x-2 mb-4">
        <Button variant="outline">Cancel</Button>
        <Button variant="secondary">Save</Button>
        <Button onClick={handleDownloadInvoice}>Download Invoice</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">New Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={invoiceRef}>
                <div className="mb-4 flex justify-between items-start">
                  <div
                    className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {logo ? (
                      <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-sm text-gray-500 w-[80%] text-center">
                        Select a file
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleLogoUpload}
                    accept="image/*"
                  />
                  <div>
                    <p>{businessInfo.name}</p>
                    {businessInfo.showPhone && <p>{businessInfo.phone}</p>}
                    <p>{businessInfo.country}</p>
                    <BusinessInfoDialog />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="billedTo">Billed To</Label>
                    <Select
                      onValueChange={(value) =>
                        setSelectedClient(clients.find((c) => c.id.toString() === value) || null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      {/* <AddClientVendorSheet isOpen={false} onOpenChange={function (open: boolean): void {
                        throw new Error("Function not implemented.")
                      } } onAddClientVendor={function (clientVendor: ClientVendor): void {
                        throw new Error("Function not implemented.")
                      } } /> */}
                    </Select>
                    {selectedClient && (
                      <Button variant="link" className="text-blue-500 p-0">
                        Remove Client
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dateOfIssue">Date of Issue</Label>
                    <div className="relative">
                      <Input id="dateOfIssue" type="date" />
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <div className="relative">
                      <Calendar />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input id="invoiceNumber" placeholder="0000001" />
                  </div>
                  <div>
                    <Label htmlFor="reference">Reference</Label>
                    <Input id="reference" placeholder="Enter value (e.g. PO #)" />
                  </div>
                </div>
                <div className="mb-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Description</th>
                        <th className="text-right pb-2">Rate</th>
                        <th className="text-right pb-2">Qty</th>
                        <th className="text-right pb-2">Line Total</th>
                        <th className="text-right pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <React.Fragment key={item.id}>
                          <tr className="border-b">
                            <td className="py-2">
                              <Input
                                value={item.name}
                                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                                placeholder="Enter an Item Name"
                              />
                            </td>
                            <td className="py-2">
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                                className="text-right"
                              />
                            </td>
                            <td className="py-2">
                              <Input
                                type="number"
                                value={item.qty}
                                onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                                className="text-right"
                              />
                            </td>
                            <td className="py-2 text-right">{(item.rate * item.qty).toFixed(2)}</td>
                            <td className="py-2 text-right">
                              <AddTaxDialog itemId={item.id} />
                              <Button variant="ghost" onClick={() => deleteItem(item.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2" colSpan={5}>
                              <Textarea
                                value={item.description}
                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                placeholder="Enter an Item Description"
                              />
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <Button variant="outline" className="mt-2" onClick={addItem}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Add a Line
                  </Button>
                </div>
                <div className="flex justify-end">
                  <div className="w-1/2">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Tax</span>
                      <span>{calculateTaxTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Enter notes or bank transfer details (optional)" />
                </div>
                <div className="mt-4">
                  <Label htmlFor="terms">Terms</Label>
                  <Textarea
                    id="terms"
                    placeholder="Enter your terms and conditions. (Pro tip: It pays to be polite. Invoices that include 'please' and 'thanks' get paid up to 2 days faster.)"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <Button variant="outline" onClick={() => attachmentInputRef.current?.click()}>
                      <PlusCircle className="w-4 h-4 mr-2" /> Add an attachment
                    </Button>
                    <input
                      type="file"
                      ref={attachmentInputRef}
                      className="hidden"
                      onChange={handleAttachmentUpload}
                      multiple
                    />
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Paperclip className="w-4 h-4 mr-2" />
                          <span>{file.name}</span>
                        </div>
                        <Button variant="ghost" onClick={() => deleteAttachment(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <p className="text-sm text-gray-500">For This Invoice</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Accept Online Payments</span>
                <span>NO</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Customize Invoice Style</span>
                <span>{">"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Send Reminders</span>
                <span>NO</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Change Late Fees</span>
                <span>NO</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Currency & Language</span>
                <span>{">"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Invoice Attachments</span>
                <span>NO</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
