import { FC, useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { useKeycloak } from '@react-keycloak/web';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Invoice, InvoiceStatus } from '../invoice-types';

const InvoiceListPage: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL_STATUSES'>('ALL_STATUSES');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:9090/api/v1/invoice/list", {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        const result = await response.json();

        if (result.success) {
          const formattedData: Invoice[] = result.data.map((invoice: any) => ({
            ...invoice,
            dateOfIssue: new Date(invoice.dateOfIssue),
            dueDate: new Date(invoice.dueDate),
          }));
          setInvoices(formattedData);
          setFilteredInvoices(formattedData);
        } else {
          console.error("Failed to fetch invoices:", result.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching invoices:", error);
      }
    };

    if (keycloak && keycloak.token) {
      fetchInvoices();
    }
  }, [keycloak.token]);

  // Filter invoices based on search term and status
  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesSearchTerm = 
        invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientVendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.dateOfIssue.toLocaleDateString().includes(searchTerm);

      const matchesStatus = statusFilter === 'ALL_STATUSES' || invoice.invoiceStatus === statusFilter;

      return matchesSearchTerm && matchesStatus;
    });

    setFilteredInvoices(filtered);
  }, [searchTerm, statusFilter, invoices]);

  const openDeleteDialog = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteInvoice = async () => {
    if (selectedInvoiceId === null) return;
    try {
      const response = await fetch(`http://localhost:9090/api/v1/invoice/delete/${selectedInvoiceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      let result;
      if (response.ok && response.status !== 204) { // Status 204 means "No Content"
        result = await response.json();
      }

      if (result?.success || response.status === 204) {
        setInvoices((prev) => prev.filter((invoice) => invoice.id !== selectedInvoiceId));
        setFilteredInvoices((prev) => prev.filter((invoice) => invoice.id !== selectedInvoiceId));
        setIsDeleteDialogOpen(false);
        setSelectedInvoiceId(null);
      } else {
        console.error("Failed to delete invoice:", result?.message || "Unknown error");
      }
    } catch (error) {
      console.error("An error occurred while deleting invoice:", error);
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const statusColors: Record<InvoiceStatus, string> = {
      'AWAITING_APPROVAL': 'bg-yellow-500',
      'APPROVED': 'bg-green-500',
      'REJECTED': 'bg-red-500',
      'PAID': 'bg-blue-500',
    };
    return <Badge className={`${statusColors[status]} text-white`}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold mb-4 sm:mb-0">Invoices</CardTitle>
          <Button className="w-full sm:w-auto" onClick={() => navigate('/dashboard/invoices/new-invoice')}>
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
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as InvoiceStatus | 'ALL_STATUSES')}>
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
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[18%]">Invoice No</TableHead>
                  <TableHead className="w-[18%]">Client/Vendor</TableHead>
                  <TableHead className="w-[18%]">Date</TableHead>
                  <TableHead className="w-[18%]">Total</TableHead>
                  <TableHead className="w-[18%]">Status</TableHead>
                  <TableHead className="w-[10%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNo}</TableCell>
                    <TableCell>{invoice.clientVendor.name}</TableCell>
                    <TableCell>{invoice.dateOfIssue.toLocaleDateString()}</TableCell>
                    <TableCell>${invoice.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.invoiceStatus)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(invoice.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/invoices/edit/${invoice.id}`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Outlet />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInvoice}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceListPage;
