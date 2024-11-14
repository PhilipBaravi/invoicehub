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
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>{t('invoice.totals.summary')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="lg:w-1/2">
            <NotesTerms invoice={invoice} setInvoice={setInvoice} />
          </div>
          <div className="lg:w-1/2 space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{t('invoice.totals.subtotal')}</span>
                <span className="font-medium">
                  ${invoice.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{t('invoice.totals.tax')}</span>
                <span className="font-medium">${invoice.tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-bold">
                <span>{t('invoice.totals.total')}</span>
                <span className="text-lg">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Totals;
