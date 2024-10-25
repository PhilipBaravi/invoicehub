import { useState, useRef, FC } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import testBusinessInfoData from './test-business-info-data';
import { useTheme } from '../layout/ThemeProvider';
import { LineItem, predefinedItems } from './predefinedItems';
import { ClientVendor } from '../clients/test-clientvendor-list-data';
import LogoUploader from './LogoUploader';
import ClientSelector from './ClientSelector';
import InvoiceDetails from './InvoiceDetails';
import LineItems from './LineItems';
import Totals from './Totals';
import Signatures from './Signatures';
import Attachments from './Attachments';
import TaxDialog from './TaxDialog';
import testClientVendorListData from '../clients/test-clientvendor-list-data';

const Invoice: FC = () => {
  const [invoice, setInvoice] = useState({
    invoiceNo: '0000002',
    dateOfIssue: new Date(),
    dueDate: new Date(),
    notes: '',
    terms: '',
    price: 0,
    tax: 0,
    total: 0,
    businessSignature: '',
    clientSignature: '',
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [showTaxDialog, setShowTaxDialog] = useState(false);
  const [taxDetails, setTaxDetails] = useState({ percentage: 0, name: '', number: '' });
  const [logo, setLogo] = useState<string | null>(null);
  const [businessSignatureImage, setBusinessSignatureImage] = useState<string | null>(null);
  const [clientSignatureImage, setClientSignatureImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasBusinessRef = useRef<any>(null);
  const sigCanvasClientRef = useRef<any>(null);
  const businessSignatureInputRef = useRef<HTMLInputElement>(null);
  const clientSignatureInputRef = useRef<HTMLInputElement>(null);
  const [selectedClient, setSelectedClient] = useState<ClientVendor | null>(null);

  const handleClientSelect = (clientName: string) => {
    const client = testClientVendorListData.data.find((c) => c.name === clientName);
    setSelectedClient(client || null);
  };

  const { theme } = useTheme();
  const penColor = theme === "dark" ? "white" : "black";

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { itemId: '', name: '', description: '', price: 0, quantity: 1, tax: 0 }]);
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedLineItems = lineItems.map((item, i) =>
      i === index ? { ...item, [field]: field === 'price' || field === 'quantity' ? Number(value) : value } : item
    );
    setLineItems(updatedLineItems);
    updateTotals(updatedLineItems);
  };

  const handleRemoveLineItem = (index: number) => {
    const updatedLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedLineItems);
    updateTotals(updatedLineItems);
  };

  const updateTotals = (items: LineItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = items.reduce((sum, item) => sum + (item.price * item.quantity * item.tax) / 100, 0);
    setInvoice({
      ...invoice,
      price: subtotal,
      tax: tax,
      total: subtotal + tax
    });
  };

  const handleAddTaxes = (index: number) => {
    setCurrentItemIndex(index);
    setShowTaxDialog(true);
  };

  const applyTaxes = () => {
    if (currentItemIndex !== null) {
      const updatedLineItems = lineItems.map((item, index) =>
        index === currentItemIndex ? { ...item, tax: taxDetails.percentage } : item
      );
      setLineItems(updatedLineItems);
      updateTotals(updatedLineItems);
      setShowTaxDialog(false);
      setCurrentItemIndex(null);
      setTaxDetails({ percentage: 0, name: '', number: '' });
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      alert(`File "${file.name}" has been selected for upload.`);
    }
  };

  const handleItemSelect = (index: number, itemId: string) => {
    const selectedItem = predefinedItems.find(item => item.id === itemId);
    if (selectedItem) {
      const updatedLineItems = lineItems.map((item, i) =>
        i === index ? { ...item, itemId, name: selectedItem.name, description: selectedItem.description, price: selectedItem.price } : item
      );
      setLineItems(updatedLineItems);
      updateTotals(updatedLineItems);
    }
  };

  const handleClearSignature = (type: 'business' | 'client') => {
    if (type === 'business') {
      sigCanvasBusinessRef.current?.clear();
      setBusinessSignatureImage(null);
    } else {
      sigCanvasClientRef.current?.clear();
      setClientSignatureImage(null);
    }
    setInvoice((prev) => ({ ...prev, [`${type}Signature`]: '' }));
  };

  const handleSaveSignature = (type: 'business' | 'client') => {
    const signatureDataUrl = type === 'business'
      ? sigCanvasBusinessRef.current?.getTrimmedCanvas().toDataURL("image/png")
      : sigCanvasClientRef.current?.getTrimmedCanvas().toDataURL("image/png");
    setInvoice((prev) => ({
      ...prev,
      [`${type}Signature`]: signatureDataUrl || ''
    }));
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'business' | 'client') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'business') {
          setBusinessSignatureImage(result);
        } else {
          setClientSignatureImage(result);
        }
        setInvoice((prev) => ({ ...prev, [`${type}Signature`]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-[95%] max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>New Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <LogoUploader logo={logo} handleLogoUpload={handleLogoUpload} />
          <div className="text-right">
            <h2 className="text-xl font-bold">{testBusinessInfoData.data.title}</h2>
            <p>{testBusinessInfoData.data.phone}</p>
            <p className="text-blue-700">{testBusinessInfoData.data.website}</p>
            <p>{testBusinessInfoData.data.address.country}</p>
            <p>{testBusinessInfoData.data.address.city}</p>
            <p>{testBusinessInfoData.data.address.addressLine1}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ClientSelector
            selectedClient={selectedClient}
            handleClientSelect={handleClientSelect}
          />
          <InvoiceDetails invoice={invoice} setInvoice={setInvoice} />
        </div>
        <LineItems
          lineItems={lineItems}
          handleAddLineItem={handleAddLineItem}
          handleLineItemChange={handleLineItemChange}
          handleRemoveLineItem={handleRemoveLineItem}
          handleAddTaxes={handleAddTaxes}
          handleItemSelect={handleItemSelect}
        />
        <Totals invoice={invoice} setInvoice={setInvoice} />
        <Signatures
          invoice={invoice}
          penColor={penColor}
          sigCanvasBusinessRef={sigCanvasBusinessRef}
          sigCanvasClientRef={sigCanvasClientRef}
          businessSignatureImage={businessSignatureImage}
          clientSignatureImage={clientSignatureImage}
          handleClearSignature={handleClearSignature}
          handleSaveSignature={handleSaveSignature}
          handleSignatureUpload={handleSignatureUpload}
          businessSignatureInputRef={businessSignatureInputRef}
          clientSignatureInputRef={clientSignatureInputRef}
        />
        <Attachments handleAttachment={handleAttachment} fileInputRef={fileInputRef} handleFileUpload={handleFileUpload} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save Invoice</Button>
      </CardFooter>
      <TaxDialog
        showTaxDialog={showTaxDialog}
        setShowTaxDialog={setShowTaxDialog}
        taxDetails={taxDetails}
        setTaxDetails={setTaxDetails}
        applyTaxes={applyTaxes}
      />
    </Card>
  );
};

export default Invoice;
