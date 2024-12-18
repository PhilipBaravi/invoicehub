import { FC } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newInvoiceCurrency: 'USD' | 'EUR' | 'GEL';
  setNewInvoiceCurrency: (currency: 'USD' | 'EUR' | 'GEL') => void;
  onConfirm: () => void;
}

const CreateInvoiceDialog: FC<CreateInvoiceDialogProps> = ({
  open,
  onOpenChange,
  newInvoiceCurrency,
  setNewInvoiceCurrency,
  onConfirm
}) => {
  const { t } = useTranslation('invoices');

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('invoiceList.dialog.chooseCurrencyTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('invoiceList.dialog.chooseCurrencyDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Select value={newInvoiceCurrency} onValueChange={(val) => setNewInvoiceCurrency(val as 'USD' | 'EUR' | 'GEL')}>
          <SelectTrigger className="w-full mt-4">
            <SelectValue placeholder={t('invoiceList.dialog.selectCurrency')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GEL">GEL</SelectItem>
          </SelectContent>
        </Select>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={() => onOpenChange(false)}>{t('invoiceList.dialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{t('invoiceList.dialog.continue')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateInvoiceDialog;
