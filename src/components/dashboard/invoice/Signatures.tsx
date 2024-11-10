import { FC } from 'react';
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SignatureCanvas from 'react-signature-canvas'
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('invoices')
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t('invoice.signatures.pageTitle')}</h3>
      <div className="grid grid-cols-2 gap-4">
      <div>
          <Label htmlFor="clientSignature" className="mb-2 block">{t('invoice.signatures.clientSignature')}</Label>
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
            <Button variant="outline" size="sm" onClick={() => handleClearSignature('client')}>{t('invoice.signatures.clear')}</Button>
            <Button variant="outline" size="sm" onClick={() => handleSaveSignature('client')}>{t('invoice.signatures.save')}</Button>
            <Label htmlFor="client-signature-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>{t('invoice.signatures.upload')}</span>
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
        <div>
          <Label htmlFor="businessSignature" className="mb-2 block">{t('invoice.signatures.businessSignature')}</Label>
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
            <Button variant="outline" size="sm" onClick={() => handleClearSignature('business')}>{t('invoice.signatures.clear')}</Button>
            <Button variant="outline" size="sm" onClick={() => handleSaveSignature('business')}>{t('invoice.signatures.save')}</Button>
            <Label htmlFor="business-signature-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>{t('invoice.signatures.upload')}</span>
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
        
      </div>
    </div>
  );
};

export default Signatures;
