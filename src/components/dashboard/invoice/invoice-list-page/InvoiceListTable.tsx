import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Mail,
  ClipboardCheck,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Invoice, InvoiceStatus } from "../invoice-types";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface InvoiceListTableProps {
  invoices: Invoice[];
  onPreview: (invoice: Invoice) => void;
  onEdit: (invoiceId: number) => void;
  onApprove: (invoiceId: number) => void;
  onSendEmail: (invoiceId: number) => void;
  onDelete: (invoiceId: number) => void;
}

const currencyIcons: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GEL: "₾",
};

const InvoiceListTable: FC<InvoiceListTableProps> = ({
  invoices,
  onPreview,
  onEdit,
  onApprove,
  onSendEmail,
  onDelete,
}) => {
  const { t } = useTranslation("invoices");

  const getStatusBadge = (status: InvoiceStatus) => {
    const statusColors: Record<InvoiceStatus, string> = {
      AWAITING_APPROVAL: "bg-yellow-500",
      APPROVED: "bg-green-500",
      REJECTED: "bg-red-500",
      PAID: "bg-blue-500",
    };
    return (
      <Badge className={`${statusColors[status]} text-white`}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[18%]">
              {t("invoiceList.invoiceNo")}
            </TableHead>
            <TableHead className="w-[18%]">{t("invoiceList.client")}</TableHead>
            <TableHead className="w-[18%]">{t("invoiceList.date")}</TableHead>
            <TableHead className="w-[18%]">{t("invoiceList.total")}</TableHead>
            <TableHead className="w-[18%]">{t("invoiceList.status")}</TableHead>
            <TableHead className="w-[10%]">
              {t("invoiceList.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => {
            const currencyIcon = currencyIcons[invoice.currency] || "";
            const displayTotal = `${currencyIcon}${invoice.total.toFixed(2)}`;

            return (
              <TableRow key={invoice.id || index}>
                <TableCell>{invoice.invoiceNo}</TableCell>
                <TableCell>{invoice.clientVendor?.name}</TableCell>
                <TableCell>
                  {invoice.dateOfIssue?.toLocaleDateString()}
                </TableCell>
                <TableCell>{displayTotal}</TableCell>
                <TableCell>{getStatusBadge(invoice.invoiceStatus)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSendEmail(invoice.id)}>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>{t("invoiceList.sendEmail")}</span>
                      </DropdownMenuItem>
                      {invoice.invoiceStatus !== "APPROVED" && (
                        <DropdownMenuItem onClick={() => onApprove(invoice.id)}>
                          <ClipboardCheck className="mr-2 h-4 w-4" />
                          <span>{t("invoiceList.approve")}</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onPreview(invoice)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>{t("invoiceList.preview")}</span>
                      </DropdownMenuItem>
                      {invoice.invoiceStatus !== "APPROVED" && (
                        <DropdownMenuItem onClick={() => onEdit(invoice.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>{t("invoiceList.edit")}</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(invoice.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("invoiceList.delete")}
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
  );
};

export default InvoiceListTable;
