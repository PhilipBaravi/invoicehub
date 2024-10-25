import { FC } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UploadIcon } from 'lucide-react';

interface LogoUploaderProps {
  logo: string | null;
  handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LogoUploader: FC<LogoUploaderProps> = ({ logo, handleLogoUpload }) => {
  return (
    <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
      {logo ? (
        <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
      ) : (
        <Label htmlFor="logo-upload" className="cursor-pointer text-center">
          <UploadIcon className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">Upload Logo</span>
        </Label>
      )}
      <Input
        id="logo-upload"
        type="file"
        className="hidden"
        onChange={handleLogoUpload}
        accept="image/*"
      />
    </div>
  );
};

export default LogoUploader;
