import { useState, useRef, FC } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
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
import LogoUploader from './LogoUploader';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  const [logo, setLogo] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleClientSelect = (clientName: string) => {
    const client = testClientVendorListData.data.find((c) => c.name === clientName);
    setSelectedClient(client || null);
  };

  const { theme } = useTheme();
  const penColor = theme === 'dark' ? 'white' : 'black';

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
    const files = event.target.files;
    if (files) {
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif',
      ];

      Array.from(files).forEach((file) => {
        if (allowedTypes.includes(file.type)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      if (invalidFiles.length > 0) {
        setErrorMessage(
          `Invalid file types: ${invalidFiles.join(
            ', '
          )}. Only PDF, DOC, DOCX, JPEG, PNG, and GIF files are allowed.`
        );
      } else {
        setErrorMessage('');
      }

      setAttachments((prev) => [...prev, ...validFiles]);

      // Reset the input value to allow uploading the same file again if needed
      event.target.value = '';
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
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

  const generatePDFAndZip = async () => {
    try {
      // Generate the Invoice PDF blob
      const invoicePdfBlob = await pdf(
        <InvoicePDF
          invoice={invoice}
          lineItems={lineItems}
          selectedClient={selectedClient}
          businessSignatureImage={businessSignatureImage}
          clientSignatureImage={clientSignatureImage}
          logo={logo}
        />
      ).toBlob();

      // Initialize JSZip
      const zip = new JSZip();

      // Add Invoice PDF to ZIP
      zip.file(`Invoice_${invoice.invoiceNo}.pdf`, invoicePdfBlob);

      // Add Attachments to ZIP
      attachments.forEach((file) => {
        zip.file(file.name, file);
      });

      // Create Combined PDF
      const combinedPdfBytes = await createCombinedPDF(invoicePdfBlob, attachments);
      zip.file(`Invoice_and_Attachments_${invoice.invoiceNo}.pdf`, combinedPdfBytes);

      // Generate the ZIP blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Trigger download using FileSaver
      saveAs(zipBlob, `Invoice_${invoice.invoiceNo}.zip`);
    } catch (error) {
      console.error('Error generating ZIP:', error);
      setErrorMessage('An error occurred while generating the ZIP file.');
    }
  };

  /**
   * Creates a combined PDF containing the Invoice and all Attachments.
   * @param invoiceBlob - The Invoice PDF as a Blob.
   * @param attachments - Array of attachment Files.
   * @returns Combined PDF as Uint8Array.
   */
  const createCombinedPDF = async (invoiceBlob: Blob, attachments: File[]): Promise<Uint8Array> => {
    // Load the Invoice PDF
    const combinedPdf = await PDFDocument.create();
    const invoicePdf = await PDFDocument.load(await invoiceBlob.arrayBuffer());
    const invoicePages = await combinedPdf.copyPages(invoicePdf, invoicePdf.getPageIndices());
    invoicePages.forEach((page: any) => combinedPdf.addPage(page));

    // Iterate through attachments and append them
    for (const file of attachments) {
      if (file.type === 'application/pdf') {
        const attachmentPdf = await PDFDocument.load(await file.arrayBuffer());
        const attachmentPages = await combinedPdf.copyPages(attachmentPdf, attachmentPdf.getPageIndices());
        attachmentPages.forEach((page: any) => combinedPdf.addPage(page));
      } else if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'
      ) {
        const imageBytes = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg') {
          image = await combinedPdf.embedJpg(imageBytes);
        } else if (file.type === 'image/png' || file.type === 'image/gif') {
          image = await combinedPdf.embedPng(imageBytes);
        } else {
          continue; // Skip unsupported image types
        }

        const imgDims = image.scale(1);

        const page = combinedPdf.addPage([imgDims.width, imgDims.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: imgDims.width,
          height: imgDims.height,
        });
      }
      // Note: DOC and DOCX files are not handled here.
      // To include them, you'd need to convert them to PDF first, which isn't straightforward on the client-side.
    }

    const combinedPdfBytes = await combinedPdf.save();
    return combinedPdfBytes;
  };

  return (
    <div className="p-4">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">New Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Align InvoiceDetails and LogoUploader horizontally */}
          <div className="flex justify-between items-start">
            {/* Left: Invoice Details */}
            <div className="w-1/2">
              <InvoiceDetails invoice={invoice} setInvoice={setInvoice} />
            </div>
            {/* Right: Logo Uploader */}
            <div className="w-1/2 flex justify-end">
              <LogoUploader logo={logo} handleLogoUpload={handleLogoUpload} />
            </div>
          </div>
          <Separator />
          {/* Align ClientSelector and Business Information horizontally */}
          <div className="flex justify-between items-center mt-6">
            {/* Left: Client Selector */}
            <div className="w-1/2">
              <ClientSelector
                selectedClient={selectedClient}
                handleClientSelect={handleClientSelect}
              />
            </div>

            {/* Right: Business Information */}
            <div className="w-1/2 text-right flex flex-col justify-start pt-16">
              <h2 className="text-xl font-bold">Company Name: {testBusinessInfoData.data.title}</h2>
              <p className="font-[600]">Phone: {testBusinessInfoData.data.phone}</p>
              <p>
                <span className="text-stone-950 dark:text-stone-50 font-[600]">Website:</span> 
                <span className="font-[600] text-blue-700"> {testBusinessInfoData.data.website}</span>
              </p>
              <p>
                <span className="text-stone-950 dark:text-stone-50 font-[600]">Email:</span> 
                <span className="font-[600] text-blue-700"> 'test@gmail.com'</span> {/* Needs to be added to businessinfodata */}
              </p>
              <p>
                <span className="font-[600]">Country:</span> 
                <span className="text-stone-950 dark:text-stone-50 font-[600]"> {testBusinessInfoData.data.address.country}</span>
              </p>
              <p>
                <span className="font-[600]">City:</span> 
                <span className="text-stone-950 dark:text-stone-50 font-[600]"> {testBusinessInfoData.data.address.city}</span>
              </p>
              <p>
                <span className="font-[600]">Address:</span> 
                <span className="text-stone-950 dark:text-stone-50 font-[600]"> {testBusinessInfoData.data.address.addressLine1}</span>
              </p>
            </div>
          </div>
          <Separator />
          <LineItems
            lineItems={lineItems}
            handleAddLineItem={handleAddLineItem}
            handleLineItemChange={handleLineItemChange}
            handleRemoveLineItem={handleRemoveLineItem}
            handleAddTaxes={handleAddTaxes}
            handleItemSelect={handleItemSelect}
          />
          <Separator />
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
          <Separator />
          <Attachments
            attachments={attachments}
            handleAttachment={handleAttachment}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            handleRemoveAttachment={handleRemoveAttachment}
          />
          {/* Display error message if any */}
          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={generatePDFAndZip}>
              Generate PDF & ZIP
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
