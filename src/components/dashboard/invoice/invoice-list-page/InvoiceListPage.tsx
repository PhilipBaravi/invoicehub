// InvoiceListPage.tsx
import { FC, useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, MoreHorizontal, Trash2, Pencil, ClipboardCheck, Eye, Mail } from 'lucide-react';
import { useKeycloak } from '@react-keycloak/web';
import { useToast } from "@/hooks/use-toast";
import InvoicePreview from './InvoicePreview';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Invoice, InvoiceStatus } from '../invoice-types';
import { useTranslation } from 'react-i18next';
import CreateInvoiceDialog from './CreateInvoiceDialog';

const currencyIcons: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GEL': '₾',
};

const InvoiceListPage: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL_STATUSES'>('ALL_STATUSES');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [, setIsApproving] = useState(false);
  const { t } = useTranslation('invoices');
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false);
  const [newInvoiceCurrency, setNewInvoiceCurrency] = useState<'USD' | 'EUR' | 'GEL'>('USD');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("https://api.invoicehub.space/api/v1/invoice/list", {
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

  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesSearchTerm =
        invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientVendor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.dateOfIssue?.toLocaleDateString().includes(searchTerm);

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
      const response = await fetch(`https://api.invoicehub.space/api/v1/invoice/delete/${selectedInvoiceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      let result;
      if (response.ok && response.status !== 204) {
        result = await response.json();
      }

      if (result?.success || response.status === 204) {
        setInvoices((prev) => prev.filter((invoice) => invoice.id !== selectedInvoiceId));
        setFilteredInvoices((prev) => prev.filter((invoice) => invoice.id !== selectedInvoiceId));
        setIsDeleteDialogOpen(false);
        setSelectedInvoiceId(null);
        toast({
          title: t('invoice.success'),
          description: t('invoice.successDeleteMessage'),
          variant: 'success',
          duration: 3000
        })
      } else {
        console.error("Failed to delete invoice:", result?.message || "Unknown error");
        toast({
          title: t('invoice.error'),
          description: t('invoice.errorMessage'),
          variant: "destructive",
          duration: 3000
        })
      }
    } catch (error) {
      console.error("An error occurred while deleting invoice:", error);
    }
  };

  const handleApproveInvoice = async (invoiceId: number) => {
    setIsApproving(true);
    try {
      const response = await fetch(`https://api.invoicehub.space/api/v1/invoice/approve/${invoiceId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice.id === invoiceId ? { ...invoice, invoiceStatus: 'APPROVED' } : invoice
          )
        );
        setFilteredInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice.id === invoiceId ? { ...invoice, invoiceStatus: 'APPROVED' } : invoice
          )
        );
        toast({
          title: t('invoice.success'),
          description: t('invoiceList.approveSuccess'),
          variant: 'success',
          duration: 3000
        })
      } else {
        console.error("Failed to approve invoice:", result.message);
        toast({
          title: t('invoice.error'),
          description: t('invoiceList.approveError'),
          variant: 'destructive',
          duration: 3000
        })
      }
    } catch (error) {
      console.error("An error occurred while approving invoice:", error);
      toast({
        title: t('invoice.error'),
        description: t('invoiceList.approveError'),
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setIsApproving(false);
    }
  };

  const handleSendEmail = async (invoiceId: number) => {
    try {
      const response = await fetch(`https://api.invoicehub.space/api/v1/mailing/send-email/${invoiceId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: t('invoice.success'),
          description: t('invoiceList.sendEmailSuccess'),
          variant: 'success',
          duration: 3000,
        });
      } else {
        toast({
          title: t('invoice.error'),
          description: t('invoiceList.sendEmailError'),
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: t('invoice.error'),
        description: t('invoiceList.sendEmailError'),
        variant: "destructive",
        duration: 3000,
      });
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

  const handleCreateNewInvoice = () => {
    setShowCurrencyDialog(true);
  };

  const handleConfirmCurrency = () => {
    setShowCurrencyDialog(false);
    navigate(`/dashboard/invoices/new-invoice?currency=${newInvoiceCurrency}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold mb-4 sm:mb-0">{t('invoiceList.pageTitle')}</CardTitle>
          <Button className="w-full sm:w-auto" onClick={handleCreateNewInvoice}>
            <PlusCircle className="mr-2 h-4 w-4" /> {t('invoiceList.createNew')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder={t('invoiceList.search')!}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                id='search-invoices-input'
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as InvoiceStatus | 'ALL_STATUSES')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('invoiceList.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_STATUSES">{t('invoiceList.all')}</SelectItem>
                <SelectItem value="AWAITING_APPROVAL">{t('invoiceList.awaiting')}</SelectItem>
                <SelectItem value="APPROVED">{t('invoiceList.approved')}</SelectItem>
                <SelectItem value="REJECTED">{t('invoiceList.rejected')}</SelectItem>
                <SelectItem value="PAID">{t('invoiceList.paid')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[18%]">{t('invoiceList.invoiceNo')}</TableHead>
                  <TableHead className="w-[18%]">{t('invoiceList.client')}</TableHead>
                  <TableHead className="w-[18%]">{t('invoiceList.date')}</TableHead>
                  <TableHead className="w-[18%]">{t('invoiceList.total')}</TableHead>
                  <TableHead className="w-[18%]">{t('invoiceList.status')}</TableHead>
                  <TableHead className="w-[10%]">{t('invoiceList.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice, index) => {
                  const currencyIcon = currencyIcons[invoice.currency] || '';
                  const displayTotal = `${currencyIcon}${invoice.total.toFixed(2)}`;
                  return (
                    <TableRow key={invoice.id || index}>
                      <TableCell key={`${invoice.id}${invoice.invoiceNo}`}>{invoice.invoiceNo}</TableCell>
                      <TableCell key={`${invoice.id}${invoice.clientVendor?.name}`}>{invoice.clientVendor?.name}</TableCell>
                      <TableCell key={`${invoice.id}${invoice.dateOfIssue}`}>{invoice.dateOfIssue?.toLocaleDateString()}</TableCell>
                      <TableCell key={`${invoice.id}total`}>{displayTotal}</TableCell>
                      <TableCell key={`${invoice.id}${invoice.invoiceStatus}`}>{getStatusBadge(invoice.invoiceStatus)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" key={`button${index}${invoice.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSendEmail(invoice.id)}>
                              <Mail className="mr-2 h-4 w-4" />
                              <span>{t('invoiceList.sendEmail')}</span>
                            </DropdownMenuItem>
                            {invoice.invoiceStatus !== 'APPROVED' && (
                              <DropdownMenuItem onClick={() => handleApproveInvoice(invoice.id)}>
                                <ClipboardCheck className="mr-2 h-4 w-4" />
                                <span>{t('invoiceList.approve')}</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => setPreviewInvoice(invoice)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>{t('invoiceList.preview')}</span>
                            </DropdownMenuItem>
                            {invoice.invoiceStatus !== 'APPROVED' && (
                              <DropdownMenuItem onClick={() => navigate(`/dashboard/invoices/edit/${invoice.id}`)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>{t('invoiceList.edit')}</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(invoice.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('invoiceList.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Outlet />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('invoiceList.dialog.sure')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('invoiceList.dialog.confirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('invoiceList.dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInvoice}>{t('invoiceList.dialog.continue')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {previewInvoice && (
        <InvoicePreview
          invoice={previewInvoice}
          isOpen={!!previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      )}

      <CreateInvoiceDialog
        open={showCurrencyDialog}
        onOpenChange={setShowCurrencyDialog}
        newInvoiceCurrency={newInvoiceCurrency}
        setNewInvoiceCurrency={setNewInvoiceCurrency}
        onConfirm={handleConfirmCurrency}
      />
    </div>
  );
};

export default InvoiceListPage;
