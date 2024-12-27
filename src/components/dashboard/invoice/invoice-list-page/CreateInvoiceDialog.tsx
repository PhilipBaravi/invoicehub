import { FC } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { CreateInvoiceDialogProps } from "./types";

const CreateInvoiceDialog: FC<CreateInvoiceDialogProps> = ({
  open,
  onOpenChange,
  newInvoiceCurrency,
  setNewInvoiceCurrency,
  onConfirm,
}) => {
  const { t } = useTranslation("invoices");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("invoiceList.dialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("invoiceList.dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Select
          value={newInvoiceCurrency}
          onValueChange={(val) =>
            setNewInvoiceCurrency(val as "USD" | "EUR" | "GEL")
          }
        >
          <SelectTrigger className="w-full mt-4">
            <SelectValue placeholder={t("invoiceList.dialog.select")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">{t("invoiceList.dialog.USD")}</SelectItem>
            <SelectItem value="EUR">{t("invoiceList.dialog.EUR")}</SelectItem>
            <SelectItem value="GEL">{t("invoiceList.dialog.GEL")}</SelectItem>
          </SelectContent>
        </Select>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {t("invoiceList.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t("invoiceList.dialog.continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateInvoiceDialog;
