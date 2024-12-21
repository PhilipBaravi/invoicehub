import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { StyledCard, cardVariants, fadeInVariants } from "@/utils/styling";

interface AttachmentsProps {
  attachments: File[];
  handleAttachment: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAttachment: (index: number) => void;
}

const Attachments: FC<AttachmentsProps> = ({
  attachments,
  handleAttachment,
  fileInputRef,
  handleFileUpload,
  handleRemoveAttachment,
}) => {
  const { t } = useTranslation("invoices");
  return (
    <StyledCard
      className="p-6 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Label htmlFor="attachments" className="block mb-4 text-lg font-semibold">
        {t("invoice.attachments.pageTitle")}
      </Label>
      <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 p-6 text-center relative rounded-lg shadow-sm">
        <Button variant="outline" onClick={handleAttachment} className="mb-4">
          {t("invoice.attachments.add")}
        </Button>
        <Input
          id="attachments"
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
        />
        {attachments.length > 0 && (
          <motion.div
            className="mt-4 text-left"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <ul className="space-y-2">
              {attachments.map((file, index) => (
                <motion.li
                  key={index}
                  className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg shadow-sm mb-2"
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-stone-800 dark:text-stone-200">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAttachment(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </StyledCard>
  );
};

export default Attachments;
