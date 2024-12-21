import React, { FC, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useKeycloak } from "@react-keycloak/web";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { StyledCard, cardVariants, fadeInVariants } from "@/utils/styling";

interface InvoiceDetailsProps {
  invoice: any;
  setInvoice: React.Dispatch<React.SetStateAction<any>>;
  isEditMode: boolean;
}

const InvoiceDetails: FC<InvoiceDetailsProps> = ({
  invoice,
  setInvoice,
  isEditMode,
}) => {
  const { keycloak } = useKeycloak();
  const { t } = useTranslation("invoices");

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        if (isEditMode) {
          // Do nothing, data is already fetched
        } else {
          const response = await fetch(
            "https://api.invoicehub.space/api/v1/invoice/generate",
            {
              headers: {
                Authorization: `Bearer ${keycloak.token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch invoice details");
          }
          const data = await response.json();
          setInvoice((prevInvoice: any) => ({
            ...prevInvoice,
            invoiceNo: data.data.invoiceNo,
            dateOfIssue: new Date(data.data.dateOfIssue),
          }));
        }
      } catch (error) {
        console.error("Error fetching invoice details:", error);
      }
    };

    if (keycloak.token) {
      fetchInvoiceDetails();
    }
  }, [keycloak.token, setInvoice, isEditMode]);

  return (
    <StyledCard
      className="space-y-6 p-6 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInVariants}>
        <Label
          htmlFor="invoiceNumber"
          className="text-lg font-semibold mb-2 block"
        >
          {t("invoice.invoiceDetails.number")}
        </Label>
        <Input
          id="invoiceNumber"
          value={invoice.invoiceNo || ""}
          readOnly
          className="w-full shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
        />
      </motion.div>
      <motion.div variants={fadeInVariants}>
        <Label
          htmlFor="dateOfIssue"
          className="text-lg font-semibold mb-2 block"
        >
          {t("invoice.invoiceDetails.dateOfIssue")}
        </Label>
        <Input
          id="dateOfIssue"
          value={
            invoice.dateOfIssue
              ? format(new Date(invoice.dateOfIssue), "PPP")
              : ""
          }
          readOnly
          className="w-full shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
        />
      </motion.div>
      <motion.div variants={fadeInVariants}>
        <Label htmlFor="dueDate" className="text-lg font-semibold mb-2 block">
          {t("invoice.invoiceDetails.dueDate")}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
              id="dueDate"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {invoice.dueDate ? (
                format(invoice.dueDate, "PPP")
              ) : (
                <span>{t("invoice.invoiceDetails.pickDate")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 border-stone-200 dark:border-stone-700 shadow-md"
            align="start"
          >
            <Calendar
              mode="single"
              selected={invoice.dueDate}
              onSelect={(date) =>
                setInvoice({ ...invoice, dueDate: date || new Date() })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </motion.div>
    </StyledCard>
  );
};

export default InvoiceDetails;
