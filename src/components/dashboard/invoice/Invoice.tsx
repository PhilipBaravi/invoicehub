// Invoice.tsx
import { useState, useRef, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import testBusinessInfoData from './test-business-info-data';
import { useTheme } from '../layout/ThemeProvider';
import testClientVendorListData, { ClientVendor } from '../clients/test-clientvendor-list-data';
import testProductListData from '../products/test-product-list-data';
import ClientSelector from './ClientSelector';
import InvoiceDetails from './InvoiceDetails';
import LineItems from './LineItems';
import Totals from './Totals';
import Signatures from './Signatures';
import Attachments from './Attachments';
import TaxDialog from './TaxDialog';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePdf';

interface LineItem {
  itemId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  tax: number;
}

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
  const penColor = theme === 'dark' ? 'white' : 'black';

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        itemId: 0,
        categoryId: 0,
        name: '',
        description: '',
        price: 0,
        quantity: 1,
        tax: 0,
      },
    ]);
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedLineItems = lineItems.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]:
              field === 'price' ||
              field === 'quantity' ||
              field === 'itemId' ||
              field === 'categoryId'
                ? Number(value)
                : value,
          }
        : item
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
      total: subtotal + tax,
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

  const handleItemSelect = (index: number, categoryId: number, productId: number) => {
    const selectedProduct = testProductListData.data.find((product) => product.id === productId);
    if (selectedProduct) {
      const updatedLineItems = lineItems.map((item, i) =>
        i === index
          ? {
              ...item,
              itemId: selectedProduct.id,
              categoryId: categoryId,
              name: selectedProduct.name,
              description: '',
              price: selectedProduct.price,
            }
          : item
      );
      setLineItems(updatedLineItems);
      updateTotals(updatedLineItems);
    }
  };

  const handleClearSignature = (type: 'business' | 'client') => {
    if (type === 'business') {
      sigCanvasBusinessRef.current?.clear();
      setBusinessSignatureImage(null);
      setInvoice((prev) => ({ ...prev, businessSignature: '' }));
    } else {
      sigCanvasClientRef.current?.clear();
      setClientSignatureImage(null);
      setInvoice((prev) => ({ ...prev, clientSignature: '' }));
    }
  };

  const handleSaveSignature = (type: 'business' | 'client') => {
    const signatureDataUrl =
      type === 'business'
        ? sigCanvasBusinessRef.current?.getTrimmedCanvas().toDataURL('image/png')
        : sigCanvasClientRef.current?.getTrimmedCanvas().toDataURL('image/png');
    if (signatureDataUrl) {
      if (type === 'business') {
        setBusinessSignatureImage(signatureDataUrl);
        setInvoice((prev) => ({ ...prev, businessSignature: signatureDataUrl }));
      } else {
        setClientSignatureImage(signatureDataUrl);
        setInvoice((prev) => ({ ...prev, clientSignature: signatureDataUrl }));
      }
    }
  };

  const handleSignatureUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'business' | 'client'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'business') {
          setBusinessSignatureImage(result);
          setInvoice((prev) => ({ ...prev, businessSignature: result }));
        } else {
          setClientSignatureImage(result);
          setInvoice((prev) => ({ ...prev, clientSignature: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = async () => {
    const blob = await pdf(
      <InvoicePDF
        invoice={invoice}
        lineItems={lineItems}
        selectedClient={selectedClient}
        businessSignatureImage={businessSignatureImage}
        clientSignatureImage={clientSignatureImage} logo={null}      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoice.invoiceNo}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">New Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-4">
              <InvoiceDetails invoice={invoice} setInvoice={setInvoice} />
              <ClientSelector
                selectedClient={selectedClient}
                handleClientSelect={handleClientSelect}
              />
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">{testBusinessInfoData.data.title}</h2>
              <p>{testBusinessInfoData.data.phone}</p>
              <p className="text-blue-700">{testBusinessInfoData.data.website}</p>
              <p>{testBusinessInfoData.data.address.country}</p>
              <p>{testBusinessInfoData.data.address.city}</p>
              <p>{testBusinessInfoData.data.address.addressLine1}</p>
            </div>
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
          <Attachments
            handleAttachment={handleAttachment}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={generatePDF}>
              Generate PDF
            </Button>
            <Button>Save Invoice</Button>
          </div>
        </CardFooter>
        <TaxDialog
          showTaxDialog={showTaxDialog}
          setShowTaxDialog={setShowTaxDialog}
          taxDetails={taxDetails}
          setTaxDetails={setTaxDetails}
          applyTaxes={applyTaxes}
        />
      </Card>
    </div>
  );
};

export default Invoice;
