import { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useKeycloak } from "@react-keycloak/web";
import { Invoice, InvoiceStatus } from "../invoice/invoice-types";
import { API_BASE_URL } from "@/lib/utils/constants";

const TransactionsCard: FC = () => {
  const { t } = useTranslation("dashboardDefault");
  const { keycloak } = useKeycloak();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}dashboard/lastThreeApproved`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          const formattedData: Invoice[] = data.data.map((invoice: any) => ({
            ...invoice,
            dateOfIssue: new Date(invoice.dateOfIssue),
            dueDate: new Date(invoice.dueDate),
          }));
          setInvoices(formattedData);
        } else {
          console.error("Failed to fetch invoices:", data.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching invoices:", error);
      }
    };

    if (keycloak && keycloak.token) {
      fetchInvoices();
    }
  }, [keycloak.token]);

  const getStatusBadge = (status: InvoiceStatus) => {
    const statusColors: Record<InvoiceStatus, string> = {
      APPROVED: "bg-green-500",
      AWAITING_APPROVAL: "bg-yellow-500",
      REJECTED: "bg-red-500",
      PAID: "bg-blue-500",
    };
    const badgeVariant: Record<
      InvoiceStatus,
      "default" | "secondary" | "destructive" | "outline" | null | undefined
    > = {
      APPROVED: "default",
      AWAITING_APPROVAL: "secondary",
      REJECTED: "destructive",
      PAID: "default",
    };
    return (
      <Badge
        variant={badgeVariant[status] || "default"}
        className={statusColors[status] || ""}
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>{t("transactionsCard.title")}</CardTitle>
          <CardDescription>
            {t("transactionsCard.titleDescription")}
          </CardDescription>
        </div>
        <Button asChild size="sm">
          <Link to="/dashboard/invoices" className="inline-flex items-center">
            {t("transactionsCard.viewAll")}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("transactionsCard.invoiceNo")}</TableHead>
              <TableHead>{t("transactionsCard.customer")}</TableHead>
              <TableHead>{t("transactionsCard.dateOfIssue")}</TableHead>
              <TableHead>{t("transactionsCard.dueDate")}</TableHead>
              <TableHead className="hidden md:table-cell">
                {t("transactionsCard.invoiceType")}
              </TableHead>
              <TableHead className="hidden md:table-cell">
                {t("transactionsCard.invoiceStatus")}
              </TableHead>
              <TableHead className="text-right">
                {t("transactionsCard.totalAmount")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNo}</TableCell>
                <TableCell className="font-medium">
                  <div>{invoice.clientVendor?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.clientVendor?.email}
                  </div>
                </TableCell>
                <TableCell>
                  {invoice.dateOfIssue?.toLocaleDateString()}
                </TableCell>
                <TableCell>{invoice.dueDate?.toLocaleDateString()}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {invoice.invoiceType}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {getStatusBadge(invoice.invoiceStatus as InvoiceStatus)}
                </TableCell>
                <TableCell className="text-right">
                  ${invoice.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionsCard;
