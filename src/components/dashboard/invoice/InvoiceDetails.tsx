import { FC } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface InvoiceDetailsProps {
  invoice: any;
  setInvoice: any;
}

const InvoiceDetails: FC<InvoiceDetailsProps> = ({ invoice, setInvoice }) => {
  return (
    <>
      <div>
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <Input id="invoiceNumber" value={invoice.invoiceNo} readOnly />
      </div>
      <div>
        <Label htmlFor="dateOfIssue">Date of Issue</Label>
        <Input id="dateOfIssue" value={format(invoice.dateOfIssue, 'dd/MM/yyyy')} readOnly />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {invoice.dueDate ? format(invoice.dueDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={invoice.dueDate}
              onSelect={(date) => setInvoice({ ...invoice, dueDate: date || new Date() })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default InvoiceDetails;
