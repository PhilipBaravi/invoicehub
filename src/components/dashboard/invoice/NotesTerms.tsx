import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { StyledCard, cardVariants, fadeInVariants } from "@/lib/utils/styling";

interface NotesTermsProps {
  invoice: any;
  setInvoice: any;
}

const NotesTerms: FC<NotesTermsProps> = ({ invoice, setInvoice }) => {
  const { t } = useTranslation("invoices");
  return (
    <StyledCard
      className="space-y-6 p-6 bg-white dark:bg-stone-800 rounded-lg shadow-md"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInVariants}>
        <Label htmlFor="notes" className="text-lg font-semibold mb-2 block">
          {t("invoice.notesTerms.pageTitle")}
        </Label>
        <Textarea
          id="notes"
          placeholder={t("invoice.notesTerms.enterNotes")}
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          className="min-h-[100px] bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200"
        />
      </motion.div>
      <motion.div variants={fadeInVariants}>
        <Label
          htmlFor="paymentTerms"
          className="text-lg font-semibold mb-2 block"
        >
          {t("invoice.notesTerms.terms")}
        </Label>
        <Textarea
          id="paymentTerms"
          placeholder={t("invoice.notesTerms.enterTerms")}
          value={invoice.paymentTerms}
          onChange={(e) =>
            setInvoice({ ...invoice, paymentTerms: e.target.value })
          }
          className="min-h-[100px] bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200"
        />
      </motion.div>
    </StyledCard>
  );
};

export default NotesTerms;
