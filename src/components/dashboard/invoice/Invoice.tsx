import React, { useState, useRef, FC, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "../layout/ThemeProvider";
import { useKeycloak } from "@react-keycloak/web";
import LineItems from "./LineItems";
import ClientSelector from "./ClientSelector";
import InvoiceDetails from "./InvoiceDetails";
import Totals from "./Totals";
import Signatures from "./Signatures";
// import Attachments from "./Attachments";
import TaxDialog from "./TaxDialog";
// import LogoUploader from "./LogoUploader";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  LineItem,
  Invoice,
  ClientVendor,
  BusinessInfo,
  Category,
  Product,
} from "./invoice-types";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/lib/hooks/use-toast";
import { motion } from "framer-motion";
import { useCurrencyRates } from "@/lib/hooks/useCurrencyRates";
import { currencySymbols } from "@/lib/utils/constants"; // If you keep currency symbols in a constants file

// -------- Services --------
import {
  getClients,
  getLoggedInCompanyDetails,
  getRawProducts,
  getInvoiceList,
  generateInvoiceNumber,
  getLineItems,
  removeLineItem,
  createOrUpdateInvoice,
  addProductToInvoice,
} from "./InvoiceService";

const InvoiceComponent: FC = () => {
  // -------------------- State -------------------- //

  const [invoice, setInvoice] = useState<Invoice>({
    id: 0,
    invoiceNo: "",
    invoiceStatus: "AWAITING_APPROVAL",
    invoiceType: "SALES",
    dateOfIssue: null,
    dueDate: new Date(),
    paymentTerms: "",
    notes: "",
    clientVendor: null,
    price: 0,
    tax: 0,
    total: 0,
    businessSignature: "",
    clientSignature: "",
    currency: "USD",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [showTaxDialog, setShowTaxDialog] = useState(false);
  const [taxDetails, setTaxDetails] = useState({
    percentage: 0,
    name: "",
    number: "",
  });
  const [businessSignatureImage, setBusinessSignatureImage] = useState<
    string | null
  >(null);
  const [clientSignatureImage, setClientSignatureImage] = useState<
    string | null
  >(null);

  // const [logo, setLogo] = useState<string | null>(null);
  // const [attachments, setAttachments] = useState<File[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [clients, setClients] = useState<ClientVendor[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState<boolean>(false);
  const [businessInformation, setBusinessInformation] =
    useState<BusinessInfo | null>(null);
  const { t } = useTranslation("invoices");
  const { toast } = useToast();
  const [, setShouldFetch] = useState<boolean>(true);

  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCurrencyParam = queryParams.get("currency");
  const selectedCurrency =
    selectedCurrencyParam === "USD" ||
    selectedCurrencyParam === "EUR" ||
    selectedCurrencyParam === "GEL"
      ? selectedCurrencyParam
      : "USD";

  const { rates } = useCurrencyRates(selectedCurrency);
  const symbol = currencySymbols[selectedCurrency] || "$";
  const rate = rates ? rates[selectedCurrency] : 1;

  const sigCanvasBusinessRef = useRef<any>(null);
  const sigCanvasClientRef = useRef<any>(null);
  const businessSignatureInputRef = useRef<HTMLInputElement>(null);
  const clientSignatureInputRef = useRef<HTMLInputElement>(null);
  const [selectedClient, setSelectedClient] = useState<ClientVendor | null>(
    null
  );
  const { theme } = useTheme();
  const penColor = theme === "dark" ? "white" : "black";

  // -------------------- Effects -------------------- //

  /**
   * 1) Fetch clients, business info, products+categories if token exists
   */
  useEffect(() => {
    const fetchAll = async () => {
      if (!keycloak || !keycloak.token) return;
      try {
        setIsLoadingClients(true);
        // 1) Business info
        const fetchedBizInfo = await getLoggedInCompanyDetails(keycloak.token);
        setBusinessInformation(fetchedBizInfo);

        // 2) Products (raw) -> Convert prices if needed
        const rawProducts = await getRawProducts(keycloak.token);
        if (rates) {
          const convertedProducts = rawProducts.map((product) => {
            const productRate = rates[product.currency];
            const convertedPrice = productRate
              ? product.price * (rate / productRate)
              : product.price;
            return { ...product, price: convertedPrice };
          });
          setProducts(convertedProducts);

          // Extract unique categories
          const uniqueCatIds = Array.from(
            new Set(convertedProducts.map((p) => p.category.id))
          );
          const uniqueCats = uniqueCatIds
            .map(
              (id) =>
                convertedProducts.find((p) => p.category.id === id)?.category
            )
            .filter((c): c is Category => c !== undefined);
          setCategories(uniqueCats);
        } else {
          console.error("No fucking clue why reates unavailable");
        }

        // 3) Clients
        const fetchedClients = await getClients(keycloak.token);
        setClients(fetchedClients);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchAll();
    setShouldFetch(false);
  }, [keycloak, t, rate, rates]);

  /**
   * 2) Generate or fetch invoice details if in create/edit mode
   */
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (!keycloak?.token) return;
      try {
        if (isEditMode) {
          // 1) Find existing invoice from the list
          const list = await getInvoiceList(keycloak.token);
          const fetchedInvoice = list.find((inv: any) => inv.id === Number(id));
          if (fetchedInvoice) {
            // Populate invoice
            setInvoice({
              id: fetchedInvoice.id,
              invoiceNo: fetchedInvoice.invoiceNo,
              invoiceStatus: fetchedInvoice.invoiceStatus,
              invoiceType: fetchedInvoice.invoiceType,
              dateOfIssue: fetchedInvoice.dateOfIssue
                ? new Date(fetchedInvoice.dateOfIssue)
                : null,
              dueDate: fetchedInvoice.dueDate
                ? new Date(fetchedInvoice.dueDate)
                : null,
              paymentTerms: fetchedInvoice.paymentTerms,
              notes: fetchedInvoice.notes,
              clientVendor: fetchedInvoice.clientVendor,
              price: fetchedInvoice.price,
              tax: fetchedInvoice.tax,
              total: fetchedInvoice.total,
              businessSignature: fetchedInvoice.businessSignature,
              clientSignature: fetchedInvoice.clientSignature,
              currency: fetchedInvoice.currency,
            });

            setSelectedClient(fetchedInvoice.clientVendor);

            // 2) Line items
            const lineItemsData = await getLineItems(
              keycloak.token,
              Number(id)
            );
            if (rates) {
              const updatedLineItems = lineItemsData.map((item: any) => {
                const productRate = rates[item.product.currency];
                const convertedPrice = productRate
                  ? item.price * (rate / productRate)
                  : item.price;
                return {
                  itemId: item.product.id,
                  categoryId: item.product.category.id,
                  name: item.product.name,
                  description: item.product.description || "",
                  price: convertedPrice,
                  quantity: item.quantity,
                  tax: item.tax,
                  maxQuantity: item.product.quantityInStock,
                  error: "",
                  productUnit: item.product.productUnit,
                };
              });
              setLineItems(updatedLineItems);
              updateTotals(updatedLineItems);
            } else {
              console.error("Unexpected error for rates");
            }
          } else {
            console.error("Invoice not found");
          }
        } else {
          // Create mode
          const data = await generateInvoiceNumber(keycloak.token);
          setInvoice((prev) => ({
            ...prev,
            invoiceNo: data.invoiceNo,
            dateOfIssue: new Date(data.dateOfIssue),
          }));
        }
      } catch (error: any) {
        console.error("Error fetching invoice details:", error);
        // setErrorMessage(error.message);
      }
    };

    fetchInvoiceDetails();
    setShouldFetch(false);
  }, [keycloak?.token, isEditMode, id, t, rate, rates]);

  // -------------------- Callbacks -------------------- //

  /**
   * Calculate subtotal, tax, total from line items
   */
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

  /**
   * Select a client from dropdown
   */
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

  /**
   * Add new line item
   */
  const handleAddLineItem = useCallback(() => {
    setLineItems((prev) => [
      ...prev,
      {
        id: 0,
        itemId: 0,
        categoryId: 0,
        name: "",
        description: "",
        price: 0,
        quantity: 1,
        tax: 0,
        maxQuantity: 0,
        error: "",
        productUnit: "",
      },
    ]);
  }, []);

  /**
   * Change a field on a particular line item
   */
  const handleLineItemChange = useCallback(
    (index: number, field: keyof LineItem, value: string | number) => {
      setLineItems((prev) => {
        const updated = prev.map((item, i) => {
          if (i !== index) return item;
          let updatedItem = { ...item, [field]: value, error: "" };

          // Validate quantity
          if (field === "quantity") {
            const selectedProd = products.find((p) => p.id === item.itemId);
            if (selectedProd) {
              const maxQuantity = selectedProd.quantityInStock;
              const requestedQty = Number(value);
              if (requestedQty > maxQuantity) {
                updatedItem.quantity = maxQuantity;
                updatedItem.error = `${t(
                  "invoice.errors.maximumQuantity"
                )} ${maxQuantity}`;
              } else if (requestedQty < 1) {
                updatedItem.quantity = 1;
                updatedItem.error = `${t("invoice.errors.minimumQuantity")}`;
              }
            }
          }
          return updatedItem;
        });
        updateTotals(updated);
        return updated;
      });
    },
    [products, t, updateTotals]
  );

  /**
   * Remove a line item
   */
  const handleRemoveLineItem = async (lineItemId: number) => {
    if (!keycloak?.token) return;
    try {
      await removeLineItem(keycloak.token, lineItemId);
      // Update state to reflect removal
      setLineItems((prev) => prev.filter((item) => item.id !== lineItemId));
      toast({
        title: "Success",
        description: "Line item removed successfully.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error removing line item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove line item.",
        variant: "destructive",
      });
    }
  };

  /**
   * Show the tax dialog for a given line item
   */
  const handleAddTaxes = useCallback(
    (index: number) => {
      setCurrentItemIndex(index);
      setTaxDetails((prevTax) => ({
        ...prevTax,
        percentage: lineItems[index].tax,
      }));
      setShowTaxDialog(true);
    },
    [lineItems]
  );

  /**
   * Apply the tax from the dialog to the chosen line item
   */
  const applyTaxes = useCallback(() => {
    if (currentItemIndex === null) return;
    setLineItems((prev) => {
      const updated = prev.map((item, i) =>
        i === currentItemIndex ? { ...item, tax: taxDetails.percentage } : item
      );
      updateTotals(updated);
      return updated;
    });
    setShowTaxDialog(false);
    setCurrentItemIndex(null);
    setTaxDetails({ percentage: 0, name: "", number: "" });
  }, [currentItemIndex, taxDetails.percentage, updateTotals]);

  /**
   * Select product for line item
   */
  const handleItemSelect = useCallback(
    (index: number, categoryId: number, productId: number) => {
      const selectedProd = products.find((p) => p.id === productId);
      if (!selectedProd) {
        toast({
          title: t("invoice.error"),
          description: t("invoice.errors.productNotFound"),
          variant: "destructive",
          duration: 3000,
        });
        setErrorMessage(`${t("invoice.errors.productNotFound")}`);
        return;
      }
      setLineItems((prev) => {
        const updated = prev.map((item, i) =>
          i === index
            ? {
                ...item,
                itemId: selectedProd.id,
                categoryId,
                name: selectedProd.name,
                description: selectedProd.description || "",
                price: selectedProd.price,
                quantity: 1,
                tax: 0,
                maxQuantity: selectedProd.quantityInStock,
                error: "",
                productUnit: selectedProd.productUnit,
              }
            : item
        );
        updateTotals(updated);
        return updated;
      });
    },
    [products, t, toast, updateTotals]
  );

  /**
   * Signatures
   */
  const handleClearSignature = useCallback((type: "business" | "client") => {
    if (type === "business") {
      sigCanvasBusinessRef.current?.clear();
      setBusinessSignatureImage(null);
      setInvoice((prev) => ({ ...prev, businessSignature: "" }));
    } else {
      sigCanvasClientRef.current?.clear();
      setClientSignatureImage(null);
      setInvoice((prev) => ({ ...prev, clientSignature: "" }));
    }
  }, []);

  const handleSaveSignature = useCallback((type: "business" | "client") => {
    const signatureDataUrl =
      type === "business"
        ? sigCanvasBusinessRef.current
            ?.getTrimmedCanvas()
            .toDataURL("image/png")
        : sigCanvasClientRef.current?.getTrimmedCanvas().toDataURL("image/png");

    if (signatureDataUrl) {
      if (type === "business") {
        setBusinessSignatureImage(signatureDataUrl);
        setInvoice((prev) => ({
          ...prev,
          businessSignature: signatureDataUrl,
        }));
      } else {
        setClientSignatureImage(signatureDataUrl);
        setInvoice((prev) => ({ ...prev, clientSignature: signatureDataUrl }));
      }
    }
  }, []);

  const handleSignatureUpload = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      type: "business" | "client"
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (type === "business") {
            setBusinessSignatureImage(result);
            setInvoice((prev) => ({ ...prev, businessSignature: result }));
          } else {
            setClientSignatureImage(result);
            setInvoice((prev) => ({ ...prev, clientSignature: result }));
          }
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  // -------------------- Save Invoice -------------------- //
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSaveInvoice = useCallback(async () => {
    if (!selectedClient) {
      setErrorMessage(t("invoice.errors.selectClient"));
      toast({
        title: t("invoice.error"),
        description: t("invoice.errors.selectClient"),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const hasErrors = lineItems.some((i) => i.error);
    if (hasErrors) {
      setErrorMessage(t("invoice.errors.lineItems"));
      toast({
        title: t("invoice.error"),
        description: t("invoice.errors.lineItems"),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!invoice.notes || !invoice.paymentTerms) {
      setErrorMessage(t("invoice.errors.notesTerms"));
      toast({
        title: t("invoice.error"),
        description: t("invoice.errors.notesTerms"),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!keycloak.token) {
      setErrorMessage("Authentication token is missing.");
      toast({
        title: "Error",
        description: "Please log in to continue.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const token = keycloak.token;

    try {
      // Build the request body for invoice
      const clientVendor = {
        id: selectedClient.id,
        name: selectedClient.name,
        phone: selectedClient.phone,
        website: selectedClient.website,
        email: selectedClient.email,
        clientVendorType: selectedClient.clientVendorType,
        address: { ...selectedClient.address },
      };

      const companyData = businessInformation
        ? {
            id: businessInformation.id,
            title: businessInformation.title,
            phone: businessInformation.phone,
            website: businessInformation.website,
            email: businessInformation.email,
            address: { ...businessInformation.address },
          }
        : null;

      const invoiceData = {
        invoiceNo: invoice.invoiceNo,
        invoiceType: invoice.invoiceType,
        dateOfIssue: invoice.dateOfIssue
          ? invoice.dateOfIssue.toISOString()
          : null,
        dueDate: invoice.dueDate ? invoice.dueDate.toISOString() : null,
        paymentTerms: invoice.paymentTerms,
        notes: invoice.notes,
        clientVendor,
        price: invoice.price,
        tax: invoice.tax,
        total: invoice.total,
        company: companyData,
        currency: selectedCurrency,
      };

      // Create/update invoice
      const invoiceId = await createOrUpdateInvoice(
        token,
        invoiceData,
        isEditMode,
        Number(id)
      );

      // If editing, remove existing line items from DB
      if (isEditMode) {
        const existingItems = await getLineItems(token, Number(id));
        for (const item of existingItems) {
          await removeLineItem(token, item.id);
        }
      }

      // Add new line items
      for (const item of lineItems) {
        const product = products.find((p) => p.id === item.itemId);
        if (!product) {
          setErrorMessage(`Product with ID ${item.itemId} not found.`);
          throw new Error("Product not found");
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
        await addProductToInvoice(token, invoiceId, lineItemData);
      }

      setShowSuccessDialog(true);
      toast({
        title: t("invoice.success"),
        description: isEditMode
          ? t("invoice.updateSuccess")
          : t("invoice.saveSuccess"),
        variant: "success",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: t("invoice.error"),
        description: t("invoice.errors.errorSavingInvoice"),
        variant: "destructive",
        duration: 3000,
      });
      console.error(error);
      // setErrorMessage(error.message);
    }
  }, [
    selectedClient,
    lineItems,
    invoice,
    businessInformation,
    selectedCurrency,
    keycloak.token,
    isEditMode,
    id,
    products,
    t,
    toast,
    setErrorMessage,
  ]);

  // -------------------- Render -------------------- //
  return (
    <div className="p-2 sm:p-4 min-h-screen bg-stone-50 dark:bg-stone-900">
      <Card className="w-full max-w-5xl mx-auto border-stone-200 dark:border-stone-700 shadow-lg">
        <CardHeader className="border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
          <CardTitle className="text-xl sm:text-2xl font-bold text-stone-800 dark:text-stone-100">
            {isEditMode
              ? t("invoiceList.editInvoice")
              : t("invoice.newInvoice")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 p-6 bg-white dark:bg-stone-800">
          {/* Invoice Details + (Optional) Logo Uploader */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-start gap-6"
          >
            <div className="w-full lg:w-1/2 bg-stone-50 dark:bg-stone-900 rounded-lg p-4">
              <InvoiceDetails
                invoice={invoice}
                setInvoice={setInvoice}
                isEditMode={isEditMode}
              />
            </div>
            {/* <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <LogoUploader logo={logo} handleLogoUpload={handleLogoUpload} />
            </div> */}
          </motion.div>

          <Separator className="bg-stone-200 dark:bg-stone-700" />

          {/* Line Items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4"
          >
            <LineItems
              lineItems={lineItems}
              handleAddLineItem={handleAddLineItem}
              handleLineItemChange={handleLineItemChange}
              handleRemoveLineItem={handleRemoveLineItem}
              handleAddTaxes={handleAddTaxes}
              handleItemSelect={handleItemSelect}
              categories={categories}
              products={products}
              isEditMode={isEditMode}
              currencySymbol={symbol}
            />
          </motion.div>

          <Separator className="bg-stone-200 dark:bg-stone-700" />

          {/* Totals + Notes/Terms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4"
          >
            <Totals
              invoice={invoice}
              setInvoice={setInvoice}
              currencySymbol={symbol}
              rate={rate}
            />
          </motion.div>

          <Separator className="bg-stone-200 dark:bg-stone-700" />

          {/* Client + Business Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-stone-50 dark:bg-stone-900 rounded-lg"
          >
            <Card className="border-stone-200 dark:border-stone-700">
              <CardHeader className="border-b border-stone-200 dark:border-stone-700">
                <CardTitle className="text-stone-800 dark:text-stone-100">
                  {t("invoice.clientSelector.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ClientSelector
                  selectedClient={selectedClient}
                  handleClientSelect={handleClientSelect}
                  clients={clients}
                  businessInformation={businessInformation}
                />
              </CardContent>
            </Card>
          </motion.div>

          <Separator className="bg-stone-200 dark:bg-stone-700" />

          {/* Signatures */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4"
          >
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
          </motion.div>

          <Separator className="bg-stone-200 dark:bg-stone-700" />

          {/* Attachments (commented out for brevity) */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4"
          >
            <Attachments
              attachments={attachments}
              handleAttachment={handleAttachment}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
              handleRemoveAttachment={handleRemoveAttachment}
            />
          </motion.div> */}

          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>{t("invoice.attachmentsError")}</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {isLoadingClients && (
            <div className="mt-4 text-stone-600 dark:text-stone-400">
              <p>{t("invoice.loadingClients")}</p>
            </div>
          )}
        </CardContent>

        <Separator className="bg-stone-200 dark:bg-stone-700" />

        {/* Footer */}
        <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 bg-stone-50 dark:bg-stone-900">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/invoices")}
            className="w-full sm:w-auto border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {t("invoice.cancel")}
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleSaveInvoice}
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900"
            >
              {isEditMode ? t("invoiceList.edit") : t("invoice.saveInvoice")}
            </Button>
          </div>
        </CardFooter>

        {/* Tax Dialog */}
        <TaxDialog
          showTaxDialog={showTaxDialog}
          setShowTaxDialog={setShowTaxDialog}
          taxDetails={taxDetails}
          setTaxDetails={setTaxDetails}
          applyTaxes={applyTaxes}
        />

        {/* Success Dialog */}
        <AlertDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
        >
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-stone-800 dark:text-stone-100">
                {t("invoice.success")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isEditMode
                  ? t("invoice.updateSuccess")
                  : t("invoice.saveSuccess")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate("/dashboard/invoices");
                }}
                className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900"
              >
                {t("invoiceList.dialog.continue")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
};

export default InvoiceComponent;
