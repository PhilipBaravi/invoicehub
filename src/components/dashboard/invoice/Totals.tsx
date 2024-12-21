import { FC } from "react";
import NotesTerms from "./NotesTerms";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { StyledCard, cardVariants, fadeInVariants } from "@/utils/styling";

interface TotalsProps {
  invoice: any;
  setInvoice: any;
  currencySymbol: string;
  rate: number;
}

const Totals: FC<TotalsProps> = ({
  invoice,
  setInvoice,
  currencySymbol,
  rate,
}) => {
  const { t } = useTranslation("invoices");
  return (
    <StyledCard
      className="w-full mt-8 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <CardHeader className="border-b border-stone-200 dark:border-stone-700 px-6 py-4">
        <CardTitle className="text-xl font-semibold text-stone-800 dark:text-stone-200">
          {t("invoice.totals.summary")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <motion.div className="w-full lg:w-1/2" variants={fadeInVariants}>
            <NotesTerms invoice={invoice} setInvoice={setInvoice} />
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2 space-y-4"
            variants={fadeInVariants}
          >
            <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  {t("invoice.totals.subtotal")}
                </span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {currencySymbol}
                  {(invoice.price * rate).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  {t("invoice.totals.tax")}
                </span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {currencySymbol}
                  {(invoice.tax * rate).toFixed(2)}
                </span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center font-bold">
                <span className="text-lg text-stone-800 dark:text-stone-200">
                  {t("invoice.totals.total")}
                </span>
                <span className="text-xl text-stone-800 dark:text-stone-200">
                  {currencySymbol}
                  {(invoice.total * rate).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </StyledCard>
  );
};

export default Totals;
