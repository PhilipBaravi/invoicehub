import { FC, useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKeycloak } from "@react-keycloak/web";
import { useToast } from "@/lib/hooks/use-toast";
import { InvoiceStatus, Invoice } from "../invoice-types";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Child Components
import InvoiceFilters from "./InvoiceFilters";
import InvoiceListTable from "./InvoiceListTable";
import CreateInvoiceDialog from "./CreateInvoiceDialog";
import InvoicePreview from "./InvoicePreview";

// Services
import {
  getInvoicesData,
  deleteInvoice,
  approveInvoice,
  sendInvoiceEmail,
} from "./invoice-list-page-services";
import StatCardSkeleton from "../../skeletons/StatCardSkeleton";

// Types for the Create Invoice Dialog

const InvoiceListPage: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    InvoiceStatus | "ALL_STATUSES"
  >("ALL_STATUSES");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const { t } = useTranslation("invoices");
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newInvoiceCurrency, setNewInvoiceCurrency] = useState<
    "USD" | "EUR" | "GEL"
  >("USD");

  // Fetch invoices on mount or whenever the token changes
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        if (keycloak?.token) {
          const data = await getInvoicesData(keycloak.token);
          setInvoices(data);
          setFilteredInvoices(data);
        } else {
          throw new Error("User is not authenticated");
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error(e.message);
        } else {
          console.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [keycloak?.token]);

  // Filter invoices whenever searchTerm, statusFilter, or invoices change
  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesSearchTerm =
        invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientVendor?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.dateOfIssue?.toLocaleDateString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL_STATUSES" ||
        invoice.invoiceStatus === statusFilter;

      return matchesSearchTerm && matchesStatus;
    });

    setFilteredInvoices(filtered);
  }, [searchTerm, statusFilter, invoices]);

  // ------------ Handlers ------------ //

  // For opening delete dialog
  const openDeleteDialog = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete invoice
  const confirmDeleteInvoice = async () => {
    if (selectedInvoiceId === null || !keycloak?.token) return;

    try {
      const isDeleted = await deleteInvoice(keycloak.token, selectedInvoiceId);
      if (isDeleted) {
        setInvoices((prev) =>
          prev.filter((invoice) => invoice.id !== selectedInvoiceId)
        );
        setFilteredInvoices((prev) =>
          prev.filter((invoice) => invoice.id !== selectedInvoiceId)
        );
        setIsDeleteDialogOpen(false);
        setSelectedInvoiceId(null);

        toast({
          title: t("invoice.success"),
          description: t("invoice.successDeleteMessage"),
          variant: "success",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("An error occurred while deleting invoice:", error);
      toast({
        title: t("invoice.error"),
        description: t("invoice.errorMessage"),
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Approve invoice
  const handleApproveInvoice = async (invoiceId: number) => {
    try {
      if (!keycloak?.token) throw new Error("User is not authenticated");
      await approveInvoice(keycloak.token, invoiceId);

      // Update local state
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId ? { ...inv, invoiceStatus: "APPROVED" } : inv
        )
      );
      setFilteredInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId ? { ...inv, invoiceStatus: "APPROVED" } : inv
        )
      );

      toast({
        title: t("invoice.success"),
        description: t("invoiceList.approveSuccess"),
        variant: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("An error occurred while approving invoice:", error);
      toast({
        title: t("invoice.error"),
        description: t("invoiceList.approveError"),
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Send email
  const handleSendEmail = async (invoiceId: number) => {
    try {
      if (!keycloak?.token) throw new Error("User is not authenticated");
      await sendInvoiceEmail(keycloak.token, invoiceId);

      toast({
        title: t("invoice.success"),
        description: t("invoice.sendEmailSuccess"),
        variant: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error sending invoice email:", error);
      toast({
        title: t("invoice.error"),
        description: t("invoice.sendEmailError"),
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Create new invoice (choose currency)
  const handleCreateNewInvoice = () => {
    setShowCurrencyDialog(true);
  };

  const handleConfirmCurrency = () => {
    setShowCurrencyDialog(false);
    navigate(`/dashboard/invoices/new-invoice?currency=${newInvoiceCurrency}`);
  };

  // Edit invoice
  const handleEditInvoice = (invoiceId: number) => {
    navigate(`/dashboard/invoices/edit/${invoiceId}`);
  };

  // Preview invoice
  const handlePreviewInvoice = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
  };

  // ------------ Render ------------ //

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold mb-4 sm:mb-0">
            {t("invoiceList.pageTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onCreateInvoice={handleCreateNewInvoice}
          />
          {loading ? (
            <StatCardSkeleton styles="w-full h-[600px]" />
          ) : (
            <InvoiceListTable
              invoices={filteredInvoices}
              onPreview={handlePreviewInvoice}
              onEdit={handleEditInvoice}
              onApprove={handleApproveInvoice}
              onSendEmail={handleSendEmail}
              onDelete={openDeleteDialog}
            />
          )}
        </CardContent>
      </Card>

      <Outlet />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("invoiceList.dialog.sure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("invoiceList.dialog.confirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              {t("invoiceList.dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInvoice}>
              {t("invoiceList.dialog.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invoice Preview Dialog */}
      {previewInvoice && (
        <InvoicePreview
          invoice={previewInvoice}
          isOpen={!!previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      )}

      {/* Create Invoice Dialog */}
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
