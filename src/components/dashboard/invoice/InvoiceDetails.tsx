import { FC, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useKeycloak } from '@react-keycloak/web';

interface InvoiceDetailsProps {
  invoice: any;
  setInvoice: React.Dispatch<React.SetStateAction<any>>;
}

const InvoiceDetails: FC<InvoiceDetailsProps> = ({ invoice, setInvoice }) => {
  const { keycloak } = useKeycloak();

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/invoice/generate', {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch invoice details');
        }
        const data = await response.json();
        setInvoice((prevInvoice: any) => ({
          ...prevInvoice,
          invoiceNo: data.data.invoiceNo,
          dateOfIssue: new Date(data.data.dateOfIssue),
        }));
      } catch (error) {
        console.error('Error fetching invoice details:', error);
      }
    };

    if (keycloak.token) {
      fetchInvoiceDetails();
    }
  }, [keycloak.token, setInvoice]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <Input id="invoiceNumber" value={invoice.invoiceNo || ''} readOnly />
      </div>
      <div>
        <Label htmlFor="dateOfIssue">Date of Issue</Label>
        <Input
          id="dateOfIssue"
          value={invoice.dateOfIssue ? format(new Date(invoice.dateOfIssue), 'dd/MM/yyyy') : ''}
          readOnly
        />
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
    </div>
  );
};

export default InvoiceDetails;
