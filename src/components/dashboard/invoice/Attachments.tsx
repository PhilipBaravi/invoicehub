import { FC } from 'react';
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AttachmentsProps {
  handleAttachment: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Attachments: FC<AttachmentsProps> = ({ handleAttachment, fileInputRef, handleFileUpload }) => {
  return (
    <div>
      <Label>Attachments</Label>
      <div className="border-2 border-dashed border-gray-300 p-4 text-center">
        <Button variant="outline" onClick={handleAttachment}>+ Add an attachment</Button>
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default Attachments;
