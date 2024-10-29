// src/components/dashboard/invoice/invoice-list-page/InvoiceListPage.tsx
import { FC, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from 'lucide-react';
import testInvoiceListData from '../test-invoice-list-data';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

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

type InvoiceStatus = "AWAITING_APPROVAL" | "APPROVED" | "REJECTED" | "PAID";
type InvoiceType = "SALES" | "PURCHASE";

interface Invoice {
  id: number;
  invoiceNo: string;
  invoiceStatus: InvoiceStatus;
  invoiceType: InvoiceType;
  dateOfIssue: Date;
  dueDate: Date;
  paymentTerms: string;
  notes: string;
  clientVendor: ClientVendor;
  price: number;
  tax: number;
  total: number;
}

const InvoiceListPage: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(testInvoiceListData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL_STATUSES');
  const [typeFilter, setTypeFilter] = useState('ALL_TYPES');

  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const filteredInvoices = testInvoiceListData.filter(invoice =>
      (
        invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientVendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.dateOfIssue.toLocaleDateString().includes(searchTerm)
      ) &&
      (statusFilter === 'ALL_STATUSES' || invoice.invoiceStatus === statusFilter) &&
      (typeFilter === 'ALL_TYPES' || invoice.invoiceType === typeFilter)
    );
    setInvoices(filteredInvoices);
  }, [searchTerm, statusFilter, typeFilter]);

  const getStatusBadge = (status: InvoiceStatus) => {
    const statusColors: Record<InvoiceStatus, string> = {
      'AWAITING_APPROVAL': 'bg-yellow-500',
      'APPROVED': 'bg-green-500',
      'REJECTED': 'bg-red-500',
      'PAID': 'bg-blue-500',
    };
    return <Badge className={`${statusColors[status]} text-white`}>{status.replace('_', ' ')}</Badge>;
  };

  const handleCreateInvoice = () => {
    navigate('/dashboard/invoices-list/invoice'); // Navigate to the Invoice component
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold mb-4 sm:mb-0">Invoices</CardTitle>
          <Button className="w-full sm:w-auto" onClick={handleCreateInvoice}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Invoice
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_STATUSES">All Statuses</SelectItem>
                <SelectItem value="AWAITING_APPROVAL">Awaiting Approval</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_TYPES">All Types</SelectItem>
                <SelectItem value="SALES">Sales</SelectItem>
                <SelectItem value="PURCHASE">Purchase</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Client/Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNo}</TableCell>
                    <TableCell>{invoice.clientVendor.name}</TableCell>
                    <TableCell>{invoice.dateOfIssue.toLocaleDateString()}</TableCell>
                    <TableCell>${invoice.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.invoiceStatus)}</TableCell>
                    <TableCell>{invoice.invoiceType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceListPage;
