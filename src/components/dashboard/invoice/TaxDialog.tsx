import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeInVariants } from "@/lib/utils/styling";

interface TaxDialogProps {
  showTaxDialog: boolean;
  setShowTaxDialog: (open: boolean) => void;
  taxDetails: { percentage: number; name: string; number: string };
  setTaxDetails: (details: {
    percentage: number;
    name: string;
    number: string;
  }) => void;
  applyTaxes: () => void;
}

const TaxDialog: FC<TaxDialogProps> = ({
  showTaxDialog,
  setShowTaxDialog,
  taxDetails,
  setTaxDetails,
  applyTaxes,
}) => {
  const { t } = useTranslation("invoices");
  return (
    <Dialog open={showTaxDialog} onOpenChange={setShowTaxDialog}>
      <DialogContent className="bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("invoice.taxDialog.addTax")}
          </DialogTitle>
        </DialogHeader>
        <motion.div
          className="space-y-4"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <Label
              htmlFor="taxPercentage"
              className="text-sm font-medium mb-1 block"
            >
              {t("invoice.taxDialog.price")} (%)
            </Label>
            <Input
              id="taxPercentage"
              type="number"
              min="0"
              placeholder="0"
              value={taxDetails.percentage}
              onChange={(e) =>
                setTaxDetails({
                  ...taxDetails,
                  percentage: Number(e.target.value),
                })
              }
              className="bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200"
            />
          </div>
          <Button className="w-full" onClick={applyTaxes}>
            {t("invoice.taxDialog.apply")}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxDialog;
