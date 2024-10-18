import { FC } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Client } from "./invoicetypes"

interface InvoiceDetailsProps {
  clients: Client[]
  selectedClient: Client | null
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>
}

const InvoiceDetails: FC<InvoiceDetailsProps> = ({
  clients,
  selectedClient,
  setSelectedClient,
}) => {
  return (
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
  )
}

export default InvoiceDetails