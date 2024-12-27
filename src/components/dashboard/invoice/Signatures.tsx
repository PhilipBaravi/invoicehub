import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { StyledCard, cardVariants, fadeInVariants } from "@/lib/utils/styling";

interface SignaturesProps {
  invoice: any;
  penColor: string;
  sigCanvasBusinessRef: React.RefObject<any>;
  sigCanvasClientRef: React.RefObject<any>;
  businessSignatureImage: string | null;
  clientSignatureImage: string | null;
  handleClearSignature: (type: "business" | "client") => void;
  handleSaveSignature: (type: "business" | "client") => void;
  handleSignatureUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "business" | "client"
  ) => void;
  businessSignatureInputRef: React.RefObject<HTMLInputElement>;
  clientSignatureInputRef: React.RefObject<HTMLInputElement>;
}

const Signatures: FC<SignaturesProps> = ({
  penColor,
  sigCanvasBusinessRef,
  sigCanvasClientRef,
  businessSignatureImage,
  clientSignatureImage,
  handleClearSignature,
  handleSaveSignature,
  handleSignatureUpload,
  businessSignatureInputRef,
  clientSignatureInputRef,
}) => {
  const { t } = useTranslation("invoices");
  return (
    <StyledCard
      className="p-6 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-xl font-semibold mb-4 text-stone-800 dark:text-stone-200">
        {t("invoice.signatures.pageTitle")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={fadeInVariants}>
          <Label
            htmlFor="client-signature-upload"
            className="text-lg font-semibold mb-2 block"
          >
            {t("invoice.signatures.clientSignature")}
          </Label>
          <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 p-4 h-40 flex flex-col items-center justify-center relative rounded-lg shadow-sm">
            {clientSignatureImage ? (
              <img
                src={clientSignatureImage}
                alt="Client Signature"
                className="max-h-full"
              />
            ) : (
              <SignatureCanvas
                ref={sigCanvasClientRef}
                penColor={penColor}
                canvasProps={{
                  className: "w-full h-full absolute inset-0 bg-transparent",
                }}
              />
            )}
          </div>
          <div className="flex space-x-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
              onClick={() => handleClearSignature("client")}
            >
              {t("invoice.signatures.clear")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
              onClick={() => handleSaveSignature("client")}
            >
              {t("invoice.signatures.save")}
            </Button>
            <Label htmlFor="client-signature-upload" className="cursor-pointer">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
              >
                <span>{t("invoice.signatures.upload")}</span>
              </Button>
            </Label>
            <Input
              id="client-signature-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleSignatureUpload(e, "client")}
              accept="image/*"
              ref={clientSignatureInputRef}
            />
          </div>
        </motion.div>

        <motion.div variants={fadeInVariants}>
          <Label
            htmlFor="business-signature-upload"
            className="text-lg font-semibold mb-2 block"
          >
            {t("invoice.signatures.businessSignature")}
          </Label>
          <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 p-4 h-40 flex flex-col items-center justify-center relative rounded-lg shadow-sm">
            {businessSignatureImage ? (
              <img
                src={businessSignatureImage}
                alt="Business Signature"
                className="max-h-full"
              />
            ) : (
              <SignatureCanvas
                ref={sigCanvasBusinessRef}
                penColor={penColor}
                canvasProps={{
                  className: "w-full h-full absolute inset-0 bg-transparent",
                }}
              />
            )}
          </div>
          <div className="flex space-x-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
              onClick={() => handleClearSignature("business")}
            >
              {t("invoice.signatures.clear")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
              onClick={() => handleSaveSignature("business")}
            >
              {t("invoice.signatures.save")}
            </Button>
            <Label
              htmlFor="business-signature-upload"
              className="cursor-pointer"
            >
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
              >
                <span>{t("invoice.signatures.upload")}</span>
              </Button>
            </Label>
            <Input
              id="business-signature-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleSignatureUpload(e, "business")}
              accept="image/*"
              ref={businessSignatureInputRef}
            />
          </div>
        </motion.div>
      </div>
    </StyledCard>
  );
};

export default Signatures;
