import { FC, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InvoiceHeader from "./InvoiceHeader"
import InvoiceDetails from "./InvoiceDetails"
import InvoiceItems from "./InvoiceItems"
import InvoiceSummary from "./InvoiceSummary"
import InvoiceNotes from "./InvoiceNotes"
import InvoiceAttachments from "./InvoiceAttachments"
import InvoiceSettings from "./InvoiceSettings"
import { BusinessInfo, Client, InvoiceItem, Tax } from "./invoicetypes"
import { downloadInvoice } from "./utils"

const InvoiceCreator : FC = () => {
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
  const invoiceRef = useRef<HTMLDivElement>(null)

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", description: "", price: 0, qty: 1, taxes: [] }])
  }

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: field === "price" || field === "qty" ? Number(value) : value } : item
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

  const handleDownloadInvoice = () => {
    if (invoiceRef.current) {
      downloadInvoice(invoiceRef.current, attachments)
    }
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
                <InvoiceHeader
                  logo={logo}
                  setLogo={setLogo}
                  businessInfo={businessInfo}
                  setBusinessInfo={setBusinessInfo}
                />
                <InvoiceDetails
                  clients={clients}
                  selectedClient={selectedClient}
                  setSelectedClient={setSelectedClient}
                />
                <InvoiceItems
                  items={items}
                  updateItem={updateItem}
                  deleteItem={deleteItem}
                  addItem={addItem}
                  addTaxToItem={addTaxToItem}
                />
                <InvoiceSummary items={items} />
                <InvoiceNotes />
                <InvoiceAttachments
                  attachments={attachments}
                  setAttachments={setAttachments}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <InvoiceSettings />
        </div>
      </div>
    </div>
  )
}

export default InvoiceCreator