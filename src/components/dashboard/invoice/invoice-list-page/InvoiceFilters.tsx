import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, PlusCircle } from "lucide-react";
import { InvoiceStatus } from "../invoice-types";
import { useTranslation } from "react-i18next";

interface InvoiceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: InvoiceStatus | "ALL_STATUSES";
  setStatusFilter: (value: InvoiceStatus | "ALL_STATUSES") => void;
  onCreateInvoice: () => void;
}

const InvoiceFilters: FC<InvoiceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onCreateInvoice,
}) => {
  const { t } = useTranslation("invoices");

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder={t("invoiceList.search")!}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="search-invoices-input"
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(value) =>
          setStatusFilter(value as InvoiceStatus | "ALL_STATUSES")
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t("invoiceList.filter")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL_STATUSES">{t("invoiceList.all")}</SelectItem>
          <SelectItem value="AWAITING_APPROVAL">
            {t("invoiceList.awaiting")}
          </SelectItem>
          <SelectItem value="APPROVED">{t("invoiceList.approved")}</SelectItem>
          <SelectItem value="REJECTED">{t("invoiceList.rejected")}</SelectItem>
          <SelectItem value="PAID">{t("invoiceList.paid")}</SelectItem>
        </SelectContent>
      </Select>
      <Button className="w-full sm:w-auto" onClick={onCreateInvoice}>
        <PlusCircle className="mr-2 h-4 w-4" /> {t("invoiceList.createNew")}
      </Button>
    </div>
  );
};

export default InvoiceFilters;
