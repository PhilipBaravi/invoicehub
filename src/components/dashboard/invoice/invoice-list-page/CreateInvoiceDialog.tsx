import { FC, useEffect, useState } from "react";
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
import {
  checkProductsData,
  checkClienData,
} from "./invoice-list-page-services";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

const CreateInvoiceDialog: FC<CreateInvoiceDialogProps> = ({
  open,
  onOpenChange,
  newInvoiceCurrency,
  setNewInvoiceCurrency,
  onConfirm,
}) => {
  const { t } = useTranslation("invoices");
  const { keycloak } = useKeycloak();
  const [newUserTrigger, setNewUserTrigger] = useState(false);
  const navigate = useNavigate();

  const checkNewUser = async () => {
    if (!keycloak.token) {
      return;
    }
    const productData = await checkProductsData(keycloak.token);
    const clientData = await checkClienData(keycloak.token);
    if (productData && clientData) {
      setNewUserTrigger(true);
    } else {
      setNewUserTrigger(false);
    }
  };

  const handleProductRedirect = () => {
    navigate("/dashboard/categories");
  };

  const handleClientRedirect = () => {
    navigate("/dashboard/clients");
  };
  useEffect(() => {
    checkNewUser();
  }, [newUserTrigger]);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {!newUserTrigger
              ? "First add clients/products."
              : t("invoiceList.dialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {!newUserTrigger
              ? "Add at least one client and product to start generating invoices"
              : t("invoiceList.dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {newUserTrigger && (
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
        )}

        <AlertDialogFooter className="mt-4">
          <div className="justify-center items-center flex w-full gap-x-4">
            <AlertDialogCancel onClick={() => onOpenChange(false)}>
              {t("invoiceList.dialog.cancel")}
            </AlertDialogCancel>
            {newUserTrigger && (
              <AlertDialogAction onClick={onConfirm}>
                {t("invoiceList.dialog.continue")}
              </AlertDialogAction>
            )}
            {newUserTrigger ? (
              <AlertDialogAction onClick={onConfirm}>
                {t("invoiceList.dialog.continue")}
              </AlertDialogAction>
            ) : (
              <>
                <AlertDialogAction onClick={handleProductRedirect}>
                  Add Products
                </AlertDialogAction>
                <AlertDialogAction onClick={handleClientRedirect}>
                  Add Clients
                </AlertDialogAction>
              </>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateInvoiceDialog;
