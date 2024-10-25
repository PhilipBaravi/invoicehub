import { FC } from 'react';
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SignatureCanvas from 'react-signature-canvas'

interface SignaturesProps {
  invoice: any;
  penColor: string;
  sigCanvasBusinessRef: React.RefObject<any>;
  sigCanvasClientRef: React.RefObject<any>;
  businessSignatureImage: string | null;
  clientSignatureImage: string | null;
  handleClearSignature: (type: 'business' | 'client') => void;
  handleSaveSignature: (type: 'business' | 'client') => void;
  handleSignatureUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'business' | 'client') => void;
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
  clientSignatureInputRef
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Signatures</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessSignature" className="mb-2 block">Business Signature</Label>
          <div className="border-2 border-dashed border-gray-300 p-4 h-32 flex flex-col items-center justify-center relative">
            {businessSignatureImage ? (
              <img src={businessSignatureImage} alt="Business Signature" className="max-h-full" />
            ) : (
              <SignatureCanvas
                ref={sigCanvasBusinessRef}
                penColor={penColor}
                canvasProps={{ className: "w-full h-full absolute inset-0" }}
              />
            )}
          </div>
          <div className="z-10 flex space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => handleClearSignature('business')}>Clear</Button>
            <Button variant="outline" size="sm" onClick={() => handleSaveSignature('business')}>Save</Button>
            <Label htmlFor="business-signature-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>Upload</span>
              </Button>
            </Label>
            <Input
              id="business-signature-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleSignatureUpload(e, 'business')}
              accept="image/*"
              ref={businessSignatureInputRef}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="clientSignature" className="mb-2 block">Client Signature</Label>
          <div className="border-2 border-dashed border-gray-300 p-4 h-32 flex flex-col items-center justify-center relative">
            {clientSignatureImage ? (
              <img src={clientSignatureImage} alt="Client Signature" className="max-h-full" />
            ) : (
              <SignatureCanvas
                ref={sigCanvasClientRef}
                penColor={penColor}
                canvasProps={{ className: "w-full h-full absolute inset-0" }}
              />
            )}
          </div>
          <div className="z-10 flex space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => handleClearSignature('client')}>Clear</Button>
            <Button variant="outline" size="sm" onClick={() => handleSaveSignature('client')}>Save</Button>
            <Label htmlFor="client-signature-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>Upload</span>
              </Button>
            </Label>
            <Input
              id="client-signature-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleSignatureUpload(e, 'client')}
              accept="image/*"
              ref={clientSignatureInputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signatures;
