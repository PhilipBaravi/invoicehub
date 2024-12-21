import { FC, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { StyledCard, cardVariants, fadeInVariants } from "@/utils/styling";

interface LogoUploaderProps {
  logo: string | null;
  handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LogoUploader: FC<LogoUploaderProps> = ({ logo, handleLogoUpload }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation("invoices");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(t("invoice.logo.errorMsg"));
        return;
      } else {
        setErrorMessage("");
        handleLogoUpload(event);
      }
    }
  };

  return (
    <StyledCard
      className="p-6 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-40 h-40 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        variants={fadeInVariants}
      >
        {logo ? (
          <>
            <img
              src={logo}
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
            {isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center transition-opacity opacity-0 hover:opacity-100">
                <Label
                  htmlFor="logo-upload"
                  className="cursor-pointer text-white text-center"
                >
                  <UploadIcon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">{t("invoice.logo.change")}</span>
                </Label>
              </div>
            )}
          </>
        ) : (
          <Label htmlFor="logo-upload" className="cursor-pointer text-center">
            <UploadIcon className="w-8 h-8 mx-auto mb-2 text-stone-400 dark:text-stone-500" />
            <span className="text-sm text-stone-600 dark:text-stone-400">
              {t("invoice.logo.upload")}
            </span>
          </Label>
        )}
        <Input
          id="logo-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/gif"
        />
      </motion.div>
      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>{t("invoice.logo.error")}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </StyledCard>
  );
};

export default LogoUploader;
