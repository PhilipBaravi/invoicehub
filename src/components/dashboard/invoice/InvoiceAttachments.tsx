import { FC, useRef } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Paperclip, X } from "lucide-react"

interface InvoiceAttachmentsProps {
  attachments: File[]
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>
}

const InvoiceAttachments: FC<InvoiceAttachmentsProps> = ({
  attachments,
  setAttachments,
}) => {
  const attachmentInputRef = useRef<HTMLInputElement>(null)

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setAttachments([...attachments, ...Array.from(files)])
    }
  }

  const deleteAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Attachments</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <Button variant="outline" onClick={() => attachmentInputRef.current?.click()}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add an attachment
        </Button>
        <input
          type="file"
          ref={attachmentInputRef}
          className="hidden"
          onChange={handleAttachmentUpload}
          multiple
        />
        {attachments.map((file, index) => (
          <div key={index} className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <Paperclip className="w-4 h-4 mr-2" />
              <span>{file.name}</span>
            </div>
            <Button variant="ghost" onClick={() => deleteAttachment(index)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InvoiceAttachments