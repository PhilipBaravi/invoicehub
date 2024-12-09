import { FC } from 'react';
import NotesTerms from './NotesTerms';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

interface TotalsProps {
  invoice: any;
  setInvoice: any;
}

const Totals: FC<TotalsProps> = ({ invoice, setInvoice }) => {
  const { t } = useTranslation('invoices');
  return (
    <Card className="w-full mt-4 sm:mt-6 lg:mt-8">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle>{t('invoice.totals.summary')}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-6 lg:gap-8">
          <div className="w-full lg:w-1/2">
            <NotesTerms invoice={invoice} setInvoice={setInvoice} />
          </div>
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="bg-muted p-4 sm:p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-sm sm:text-base text-muted-foreground">{t('invoice.totals.subtotal')}</span>
                <span className="font-medium text-sm sm:text-base">
                  ${invoice.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-sm sm:text-base text-muted-foreground">{t('invoice.totals.tax')}</span>
                <span className="font-medium text-sm sm:text-base">${invoice.tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2 sm:my-3" />
              <div className="flex justify-between items-center font-bold">
                <span className="text-base sm:text-lg">{t('invoice.totals.total')}</span>
                <span className="text-lg sm:text-xl">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Totals;