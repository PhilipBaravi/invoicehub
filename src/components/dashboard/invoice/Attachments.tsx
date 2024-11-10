import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  handleRemoveAttachment
}) => {
  const { t } = useTranslation('invoices')
  return (
    <div>
      <Label className="block mb-2">{t('invoice.attachments.pageTitle')}</Label>
      <div className="border-2 border-dashed border-gray-300 p-4 text-center relative">
        <Button variant="outline" onClick={handleAttachment}>{t('invoice.attachments.add')}</Button>
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
        />
        {attachments.length > 0 && (
          <div className="mt-4 text-left">
            <ul>
              {attachments.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-100 mb-2 rounded">
                  <span>{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attachments;
