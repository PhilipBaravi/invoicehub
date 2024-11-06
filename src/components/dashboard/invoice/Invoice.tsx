import React, { useState, useRef, FC, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTheme } from '../layout/ThemeProvider';
import { useKeycloak } from '@react-keycloak/web';
import LineItems from './LineItems';
import ClientSelector from './ClientSelector';
import InvoiceDetails from './InvoiceDetails';
import Totals from './Totals';
import Signatures from './Signatures';
import Attachments from './Attachments';
import TaxDialog from './TaxDialog';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePdf';
import LogoUploader from './LogoUploader';
import { Separator } from '@/components/ui/separator';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert';
import {
  LineItem,
  Invoice,
  ClientVendor,
  BusinessInfo,
  Category,
  Product,
} from './invoice-types';


const InvoiceComponent: FC = () => {
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNo: '',
    invoiceStatus: 'AWAITING_APPROVAL',
    invoiceType: 'SALES',
    dateOfIssue: null,
    dueDate: new Date(),
    paymentTerms: '',
    notes: '',
    terms: '',
    clientVendor: null,
    price: 0,
    tax: 0,
    total: 0,
    businessSignature: '',
    clientSignature: '',
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(
    null
  );
  const [showTaxDialog, setShowTaxDialog] = useState(false);
  const [taxDetails, setTaxDetails] = useState({
    percentage: 0,
    name: '',
    number: '',
  });
  const [businessSignatureImage, setBusinessSignatureImage] = useState<
    string | null
  >(null);
  const [clientSignatureImage, setClientSignatureImage] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasBusinessRef = useRef<any>(null);
  const sigCanvasClientRef = useRef<any>(null);
  const businessSignatureInputRef = useRef<HTMLInputElement>(null);
  const clientSignatureInputRef = useRef<HTMLInputElement>(null);
  const [selectedClient, setSelectedClient] = useState<ClientVendor | null>(null);

  const [logo, setLogo] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { keycloak } = useKeycloak();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [clients, setClients] = useState<ClientVendor[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState<boolean>(false);
  const [businessInformation, setBusinessInformation] = useState<BusinessInfo | null>(null);

  const updateTotals = useCallback((items: LineItem[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = items.reduce(
      (sum, item) => sum + (item.price * item.quantity * item.tax) / 100,
      0
    );
    const total = subtotal + tax;
    setInvoice((prev) => ({
      ...prev,
      price: subtotal,
      tax: tax,
      total: total,
    }));
  }, []);

  // Fetch products and categories
  const fetchProductsAndCategories = useCallback(async () => {
    try {
      const response = await fetch(
        'http://localhost:9090/api/v1/product/list',
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        const uniqueCategories = Array.from(
          new Set(data.data.map((product: Product) => product.category.id))
        )
          .map((id) =>
            data.data.find(
              (product: Product) => product.category.id === id
            )?.category
          )
          .filter(
            (category): category is Category => category !== undefined
          );

        setCategories(uniqueCategories);
      } else {
        setErrorMessage(
          `Failed to fetch products and categories: ${data.message}`
        );
      }
    } catch (error) {
      setErrorMessage('Error fetching products and categories.');
    }
  }, [keycloak.token]);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        const response = await fetch(
          'http://localhost:9090/api/v1/clientVendor/list',
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setClients(data.data);
        } else {
          setErrorMessage(`Failed to fetch clients: ${data.message}`);
        }
      } catch (error) {
        setErrorMessage('Error fetching clients.');
      } finally {
        setIsLoadingClients(false);
      }
    };

    const fetchLoggedInCompanyDetails = async () => {
      try {
        const response = await fetch(
          'http://localhost:9090/api/v1/company/loggedInUserCompany',
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setBusinessInformation(data.data);
        } else {
          setErrorMessage('Error fetching business information');
        }
      } catch (error) {
        setErrorMessage('Error fetching business information');
      }
    };

    if (keycloak && keycloak.token) {
      fetchLoggedInCompanyDetails();
      fetchProductsAndCategories();
      fetchClients();
    }
  }, [keycloak, fetchProductsAndCategories]);

  const handleClientSelect = useCallback(
    (clientName: string) => {
      const client = clients.find((c) => c.name === clientName);
      if (client) {
        setSelectedClient(client);
        setInvoice((prevInvoice) => ({
          ...prevInvoice,
          clientVendor: client,
        }));
      } else {
        setSelectedClient(null);
      }
    },
    [clients]
  );
  

  const { theme } = useTheme();
  const penColor = theme === 'dark' ? 'white' : 'black';

  const handleLogoUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogo(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleAddLineItem = useCallback(() => {
    setLineItems((prev) => [
      ...prev,
      {
        itemId: 0,
        categoryId: 0,
        name: '',
        description: '',
        price: 0,
        quantity: 1,
        tax: 0, // Initialize 'tax' to 0
        maxQuantity: 0, // Initialize maxQuantity
        error: '',
      },
    ]);
  }, []);

  const handleLineItemChange = useCallback(
    (index: number, field: keyof LineItem, value: string | number) => {
      setLineItems((prev) => {
        const updatedLineItems = prev.map((item, i) => {
          if (i === index) {
            let updatedItem = {
              ...item,
              [field]:
                field === 'price' ||
                field === 'quantity' ||
                field === 'itemId' ||
                field === 'categoryId' ||
                field === 'tax'
                  ? Number(value)
                  : value,
              error: '',
            };

            // Check for quantity exceeding maxQuantity
            if (field === 'quantity') {
              const selectedProduct = products.find(
                (product) => product.id === item.itemId
              );
              if (selectedProduct) {
                const maxQuantity = selectedProduct.quantityInStock;
                if (Number(value) > maxQuantity) {
                  updatedItem.quantity = maxQuantity;
                  updatedItem.error = `Maximum available quantity is ${maxQuantity}`;
                } else if (Number(value) < 1) {
                  updatedItem.quantity = 1;
                  updatedItem.error = `Minimum quantity is 1`;
                }
              }
            }

            return updatedItem;
          }
          return item;
        });
        updateTotals(updatedLineItems);
        return updatedLineItems;
      });
    },
    [products, updateTotals]
  );

  const handleRemoveLineItem = useCallback(
    (index: number) => {
      setLineItems((prev) => {
        const updatedLineItems = prev.filter((_, i) => i !== index);
        updateTotals(updatedLineItems);
        return updatedLineItems;
      });
    },
    [updateTotals]
  );

  const handleAddTaxes = useCallback((index: number) => {
    setCurrentItemIndex(index);
    setShowTaxDialog(true);
  }, []);

  const applyTaxes = useCallback(() => {
    if (currentItemIndex !== null) {
      setLineItems((prev) => {
        const updatedLineItems = prev.map((item, index) =>
          index === currentItemIndex
            ? { ...item, tax: taxDetails.percentage }
            : item
        );
        updateTotals(updatedLineItems);
        return updatedLineItems;
      });
      setShowTaxDialog(false);
      setCurrentItemIndex(null);
      setTaxDetails({ percentage: 0, name: '', number: '' });
    }
  }, [currentItemIndex, taxDetails.percentage, updateTotals]);

  const handleAttachment = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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

        event.target.value = '';
      }
    },
    []
  );

  const handleRemoveAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleItemSelect = useCallback(
    (index: number, categoryId: number, productId: number) => {
      const selectedProduct = products.find(
        (product) => product.id === productId
      );
      if (selectedProduct) {
        setLineItems((prev) => {
          const updatedLineItems = prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  itemId: selectedProduct.id,
                  categoryId: categoryId,
                  name: selectedProduct.name,
                  description: selectedProduct.description || '',
                  price: selectedProduct.price,
                  quantity: 1, // Reset quantity to 1
                  maxQuantity: selectedProduct.quantityInStock, // Set maxQuantity
                  error: '',
                }
              : item
          );
          updateTotals(updatedLineItems);
          return updatedLineItems;
        });
      } else {
        setErrorMessage(`Selected product not found.`);
      }
    },
    [products, updateTotals]
  );

  const handleClearSignature = useCallback(
    (type: 'business' | 'client') => {
      if (type === 'business') {
        sigCanvasBusinessRef.current?.clear();
        setBusinessSignatureImage(null);
        setInvoice((prev) => ({ ...prev, businessSignature: '' }));
      } else {
        sigCanvasClientRef.current?.clear();
        setClientSignatureImage(null);
        setInvoice((prev) => ({ ...prev, clientSignature: '' }));
      }
    },
    []
  );

  const handleSaveSignature = useCallback((type: 'business' | 'client') => {
    const signatureDataUrl =
      type === 'business'
        ? sigCanvasBusinessRef.current
            ?.getTrimmedCanvas()
            .toDataURL('image/png')
        : sigCanvasClientRef.current
            ?.getTrimmedCanvas()
            .toDataURL('image/png');
    if (signatureDataUrl) {
      if (type === 'business') {
        setBusinessSignatureImage(signatureDataUrl);
        setInvoice((prev) => ({
          ...prev,
          businessSignature: signatureDataUrl,
        }));
      } else {
        setClientSignatureImage(signatureDataUrl);
        setInvoice((prev) => ({
          ...prev,
          clientSignature: signatureDataUrl,
        }));
      }
    }
  }, []);

  const handleSignatureUpload = useCallback(
    (
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
            setInvoice((prev) => ({
              ...prev,
              businessSignature: result,
            }));
          } else {
            setClientSignatureImage(result);
            setInvoice((prev) => ({
              ...prev,
              clientSignature: result,
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const createCombinedPDF = useCallback(
    async (invoiceBlob: Blob, attachments: File[]): Promise<Uint8Array> => {
      const combinedPdf = await PDFDocument.create();
      const invoicePdf = await PDFDocument.load(
        await invoiceBlob.arrayBuffer()
      );
      const invoicePages = await combinedPdf.copyPages(
        invoicePdf,
        invoicePdf.getPageIndices()
      );
      invoicePages.forEach((page: any) => combinedPdf.addPage(page));

      for (const file of attachments) {
        if (file.type === 'application/pdf') {
          const attachmentPdf = await PDFDocument.load(
            await file.arrayBuffer()
          );
          const attachmentPages = await combinedPdf.copyPages(
            attachmentPdf,
            attachmentPdf.getPageIndices()
          );
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
          } else if (
            file.type === 'image/png' ||
            file.type === 'image/gif'
          ) {
            image = await combinedPdf.embedPng(imageBytes);
          } else {
            continue;
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
      }

      const combinedPdfBytes = await combinedPdf.save();
      return combinedPdfBytes;
    },
    []
  );

  const generatePDFAndZip = useCallback(async () => {
    try {
      const invoicePdfBlob = await pdf(
        <InvoicePDF
          invoice={invoice}
          lineItems={lineItems}
          selectedClient={selectedClient}
          businessSignatureImage={businessSignatureImage}
          clientSignatureImage={clientSignatureImage}
          logo={logo}
          businessInformation={businessInformation}
          categories={categories}
        />
      ).toBlob();

      const zip = new JSZip();

      zip.file(`Invoice_${invoice.invoiceNo}.pdf`, invoicePdfBlob);

      attachments.forEach((file) => {
        zip.file(file.name, file);
      });

      const combinedPdfBytes = await createCombinedPDF(
        invoicePdfBlob,
        attachments
      );
      zip.file(
        `Invoice_and_Attachments_${invoice.invoiceNo}.pdf`,
        combinedPdfBytes
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      saveAs(zipBlob, `Invoice_${invoice.invoiceNo}.zip`);
    } catch (error) {
      setErrorMessage('An error occurred while generating the ZIP file.');
    }
  }, [
    invoice,
    lineItems,
    selectedClient,
    businessSignatureImage,
    clientSignatureImage,
    logo,
    attachments,
    createCombinedPDF,
    businessInformation,
    categories,
  ]);

  const handleSaveInvoice = useCallback(async () => {
    // Perform all validations before making any API calls
    if (!selectedClient) {
      setErrorMessage('Please select a client.');
      return;
    }

    // Check for errors in line items
    const hasErrors = lineItems.some((item) => item.error);
    if (hasErrors) {
      setErrorMessage('Please fix errors in line items before saving.');
      return;
    }

    // Check that notes and terms are not empty
    if (!invoice.notes || !invoice.terms) {
      setErrorMessage('Please fill in both Notes and Terms.');
      return;
    }

    // You can add more validations as needed

    try {
      // Now proceed with API calls
      const clientVendor = {
        name: selectedClient.name,
        phone: selectedClient.phone,
        website: selectedClient.website,
        email: selectedClient.email,
        clientVendorType: selectedClient.clientVendorType,
        address: {
          addressLine1: selectedClient.address.addressLine1,
          addressLine2: selectedClient.address.addressLine2,
          city: selectedClient.address.city,
          state: selectedClient.address.state,
          country: selectedClient.address.country,
          zipCode: selectedClient.address.zipCode,
        },
      };

      const invoiceData = {
        invoiceNo: invoice.invoiceNo,
        invoiceType: invoice.invoiceType,
        dateOfIssue: invoice.dateOfIssue
          ? invoice.dateOfIssue.toISOString()
          : null,
        dueDate: invoice.dueDate ? invoice.dueDate.toISOString() : null,
        paymentTerms: invoice.paymentTerms,
        notes: invoice.notes,
        terms: invoice.terms,
        clientVendor: clientVendor,
        price: invoice.price,
        tax: invoice.tax,
        total: invoice.total,
      };

      const response = await fetch(
        'http://localhost:9090/api/v1/invoice/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify(invoiceData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        setErrorMessage(
          `Server Error: ${errorResponse.message || 'Unknown error'}`
        );
        throw new Error('Failed to create invoice');
      }

      const responseData = await response.json();
      const invoiceId = responseData.data.id;

      for (const item of lineItems) {
        const product = products.find((p) => p.id === item.itemId);
        if (!product) {
          setErrorMessage(`Product with ID ${item.itemId} not found.`);
          throw new Error('Product not found');
        }

        const taxAmount = (item.price * item.quantity * item.tax) / 100;

        const lineItemData = {
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          tax: item.tax,
          total: item.price * item.quantity + taxAmount,
          product: product,
        };

        const productResponse = await fetch(
          `http://localhost:9090/api/v1/invoice/add/product/${invoiceId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${keycloak.token}`,
            },
            body: JSON.stringify(lineItemData),
          }
        );

        if (!productResponse.ok) {
          const errorResponse = await productResponse.json();
          setErrorMessage(
            `Error adding product to invoice: ${
              errorResponse.message || 'Unknown error'
            }`
          );
          throw new Error('Failed to add product to invoice');
        }
      }

      // Fetch updated product list to reflect new quantities
      await fetchProductsAndCategories();

      alert('Invoice saved successfully');
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while saving the invoice.');
    }
  }, [
    invoice,
    lineItems,
    selectedClient,
    keycloak.token,
    products,
    fetchProductsAndCategories,
  ]);

  return (
    <div className="p-4">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">New Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="w-1/2">
              <InvoiceDetails invoice={invoice} setInvoice={setInvoice} />
            </div>
            <div className="w-1/2 flex justify-end">
              <LogoUploader logo={logo} handleLogoUpload={handleLogoUpload} />
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center mt-6">
            <div className="w-1/2">
              <ClientSelector
                selectedClient={selectedClient}
                handleClientSelect={handleClientSelect}
                clients={clients}
              />
            </div>
            <div className="w-1/2 text-right flex flex-col justify-start pt-16">
              {businessInformation ? (
                <>
                  <h2 className="text-xl font-bold">
                    Company Name: {businessInformation.title}
                  </h2>
                  <p className="font-[600]">Phone: {businessInformation.phone}</p>
                  <p>
                    <span className="text-stone-950 dark:text-stone-50 font-[600]">
                      Website:
                    </span>
                    <span className="font-[600] text-blue-700">
                      {' '}
                      {businessInformation.website}
                    </span>
                  </p>
                  <p>
                    <span className="text-stone-950 dark:text-stone-50 font-[600]">
                      Email:
                    </span>
                    <span className="font-[600] text-blue-700">
                      {' '}
                      {businessInformation.email}
                    </span>
                  </p>
                  <p>
                    <span className="font-[600]">Country:</span>
                    <span className="text-stone-950 dark:text-stone-50 font-[600]">
                      {' '}
                      {businessInformation.address.country}
                    </span>
                  </p>
                  <p>
                    <span className="font-[600]">City:</span>
                    <span className="text-stone-950 dark:text-stone-50 font-[600]">
                      {' '}
                      {businessInformation.address.city}
                    </span>
                  </p>
                  <p>
                    <span className="font-[600]">Address:</span>
                    <span className="text-stone-950 dark:text-stone-50 font-[600]">
                      {' '}
                      {businessInformation.address.addressLine1}
                    </span>
                  </p>
                </>
              ) : (
                <div>Loading Data...</div>
              )}
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
            categories={categories}
            products={products}
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
          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {isLoadingClients && (
            <div className="mt-4">
              <p>Loading clients...</p>
            </div>
          )}
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={generatePDFAndZip}>
              Generate PDF & ZIP
            </Button>
            <Button onClick={handleSaveInvoice}>Save Invoice</Button>
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

export default InvoiceComponent;
