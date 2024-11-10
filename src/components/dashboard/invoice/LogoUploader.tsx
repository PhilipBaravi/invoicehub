import { FC, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadIcon } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

interface LogoUploaderProps {
  logo: string | null;
  handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LogoUploader: FC<LogoUploaderProps> = ({ logo, handleLogoUpload }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation('invoices')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(t('invoice.logo.errorMsg'));
        return;
      } else {
        setErrorMessage('');
        handleLogoUpload(event);
      }
    }
  };

  return (
    <div
      className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {logo ? (
        <>
          <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <Label htmlFor="logo-upload" className="cursor-pointer text-white text-center">
                <UploadIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">{t('invoice.logo.change')}</span>
              </Label>
            </div>
          )}
        </>
      ) : (
        <Label htmlFor="logo-upload" className="cursor-pointer text-center">
          <UploadIcon className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">{t('invoice.logo.upload')}</span>
        </Label>
      )}
      <Input
        id="logo-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/gif"
      />
      {errorMessage && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>{t('invoice.logo.error')}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LogoUploader;
