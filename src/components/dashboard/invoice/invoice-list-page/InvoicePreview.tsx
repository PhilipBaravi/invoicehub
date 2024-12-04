import { FC, useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Invoice, InvoiceProduct } from '../invoice-types';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import { DialogTitle } from '@radix-ui/react-dialog';

interface InvoicePreviewProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

const InvoicePreview: FC<InvoicePreviewProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const [lineItems, setLineItems] = useState<InvoiceProduct[]>([]);
  const { keycloak } = useKeycloak();
  const { t } = useTranslation('invoices');

  useEffect(() => {
    const fetchLineItems = async () => {
      try {
        const response = await fetch(`https://invoicehub-lb-1106916193.us-east-1.elb.amazonaws.com/api/v1/invoice/product/list/${invoice.id}`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setLineItems(result.data);
        }
      } catch (error) {
        console.error('Error fetching line items:', error);
      }
    };

    if (isOpen && invoice.id) {
      fetchLineItems();
    }
  }, [isOpen, invoice.id, keycloak.token]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogTitle>
            Preview Invoice
        </DialogTitle>
        <ScrollArea className="h-[80vh] w-full rounded-md p-4">
          <div className="max-w-[800px] mx-auto bg-white rounded-lg shadow-sm p-12">
            {/* Header Section */}
            <div className="flex mb-12">
              <div className="w-[60%]">
                <h1 className="text-[1.7rem] text-[#5c6ac4] dark:text-[#5c6ac4] mb-4">{t('invoice.pdf.invoice')}</h1>
                <p className="mb-2 text-[#94a3b8] text-[0.85rem]">{t('invoiceList.invoiceNo')} {invoice.invoiceNo}</p>
                <p className="mb-2 text-[#94a3b8] text-[0.85rem]">{t('invoice.pdf.dateIssue')} {new Date(invoice.dateOfIssue!).toLocaleDateString()}</p>
                <p className="mb-2 text-[#94a3b8] text-[0.85rem]">{t('invoice.pdf.dueDate')} {new Date(invoice.dueDate!).toLocaleDateString()}</p>
              </div>
              <div className="w-[40%] text-right">
                <img
                  src="https://raw.githubusercontent.com/templid/email-templates/main/templid-dynamic-templates/invoice-02/brand-sample.png"
                  alt="Company Logo"
                  className="w-[170px] h-auto ml-auto"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-12">
              <table className="w-full border-collapse text-[0.875rem]">
                <thead>
                  <tr>
                    <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] dark:text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.category')}</th>
                    <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] dark:text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.product')}</th>
                    <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] dark:text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.price')}</th>
                    <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] dark:text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.quantity')}</th>
                    <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] dark:text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.totals.tax')}</th>
                    <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] dark:text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.lineTotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <>
                    <tr key={item.id}>
                      <td className="py-3 px-3 text-left border-b border-[#e5e7eb] text-stone-950 dark:text-stone-950" key={`product-${item.id}`}>{item.product.category.description}</td>
                      <td className="py-3 px-3 text-left border-b border-[#e5e7eb] text-stone-950 dark:text-stone-950" key={`companyName-${item.id}`}>{item.product.name}</td>
                      <td className="py-3 px-3 text-left border-b border-[#e5e7eb] text-stone-950 dark:text-stone-950" key={`price-${item.id}`}>${item.price.toFixed(2)}</td>
                      <td className="py-3 px-3 text-left border-b border-[#e5e7eb] text-stone-950 dark:text-stone-950" key={`quantity-${item.id}`}>{item.quantity}</td>
                      <td className="py-3 px-3 text-left border-b border-[#e5e7eb] text-stone-950 dark:text-stone-950" key={`tax-${item.id}`}>${item.tax.toFixed(2)}</td>
                      <td className="py-3 px-3 text-left border-b border-[#e5e7eb] text-stone-950 dark:text-stone-950" key={`total-${item.id}`}>${item.total.toFixed(2)}</td>
                    </tr>
                    <tr key={`desc-${item.id}`}>
                    <td colSpan={6} className="py-3 px-3 text-left border-b border-[#e5e7eb] bg-[#f9f9f9] text-stone-950 dark:text-stone-950" key={`desc-item-${item.id}`} >
                      {t('invoice.lineItems.description')} <span>{item.product.description}</span>
                    </td>
                  </tr>
                  </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes and Totals Section */}
            <div className="flex mb-12">
              <div className="w-[60%] pr-6">
                <div className="mb-8">
                  <div className="bg-[#f1f5f9] p-6 rounded-lg">
                    <h3 className="text-[#5c6ac4] dark:text-[#5c6ac4] mb-4 text-[1.1rem] font-bold">{t('invoice.notesTerms.pageTitle')}</h3>
                    <p className='text-stone-950 dark:text-stone-950'>{invoice.notes}</p>
                  </div>
                </div>
                <div>
                  <div className="bg-[#f1f5f9] p-6 rounded-lg">
                    <h3 className="text-[#5c6ac4] dark:text-[#5c6ac4] mb-4 text-[1.1rem] font-bold">{t('invoice.notesTerms.terms')}</h3>
                    <p className='text-stone-950 dark:text-stone-950'>{invoice.paymentTerms}</p>
                  </div>
                </div>
              </div>
              <div className="w-[40%]">
                <div className="bg-[#f1f5f9] rounded-lg">
                  <div className="p-3 px-6 border-b border-[#e5e7eb]">
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">{t('invoice.totals.subtotal')}</span>
                      <span className="text-[#5c6ac4] dark:text-[#5c6ac4] font-bold">${invoice.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="p-3 px-6 border-b border-[#e5e7eb]">
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">{t('invoice.totals.tax')}</span>
                      <span className="text-[#5c6ac4] dark:text-[#5c6ac4] font-bold">${invoice.tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="p-3 px-6 bg-[#5c6ac4] rounded-b-lg">
                    <div className="flex justify-between">
                      <span className="text-white font-bold text-[1.1rem]">{t('invoice.totals.total')}</span>
                      <span className="text-white font-bold text-[1.1rem]">${invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="flex mb-12">
              <div className="w-1/2 pr-6">
                <h2 className="text-[#5c6ac4] dark:text-[#5c6ac4] mb-4 text-[1.25rem] font-bold">{t('invoice.pdf.bill')}</h2>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.name')}</strong> {invoice.clientVendor?.name}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.phone')}</strong> {invoice.clientVendor?.phone}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.website')}</strong> {invoice.clientVendor?.website}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.email')}</strong> {invoice.clientVendor?.email}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.country')}</strong> {invoice.clientVendor?.address.country}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.city')}</strong> {invoice.clientVendor?.address.city}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.address')}</strong> {invoice.clientVendor?.address.addressLine1}
                </p>
              </div>
              <div className="w-1/2 pl-6 text-right">
                <h2 className="text-[#5c6ac4] dark:text-[#5c6ac4] mb-4 text-[1.25rem] font-bold">{t('invoice.pdf.businessInfo')}</h2>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.name')}</strong> {invoice.clientVendor?.name}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.phone')}</strong> {invoice.clientVendor?.phone}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.website')}</strong> {invoice.clientVendor?.website}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.email')}</strong> {invoice.clientVendor?.email}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.country')}</strong> {invoice.clientVendor?.address.country}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.city')}</strong> {invoice.clientVendor?.address.city}
                </p>
                <p className="mb-2 text-[0.875rem] text-[#525252]">
                  <strong>{t('invoice.pdf.address')}</strong> {invoice.clientVendor?.address.addressLine1}
                </p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex">
              <div className="w-1/2 pr-6">
                <h3 className="text-[#5c6ac4] dark:text-[#5c6ac4] mb-4 text-[1.1rem] font-bold">{t('invoice.pdf.clientSignature')}</h3>
                <div className="mt-4 p-4 border-b border-[#e5e7eb]">
                  {invoice.clientSignature && (
                    <img
                      src={invoice.clientSignature}
                      alt="Client Signature"
                      className="max-w-[200px] h-auto"
                    />
                  )}
                </div>
              </div>
              <div className="w-1/2 pl-6 text-right">
                <h3 className="text-[#5c6ac4] dark:text-[#5c6ac4] mb-4 text-[1.1rem] font-bold">{t('invoice.pdf.businessSignature')}</h3>
                <div className="mt-4 p-4 border-b border-[#e5e7eb]">
                  {invoice.businessSignature && (
                    <img
                      src={invoice.businessSignature}
                      alt="Business Signature"
                      className="max-w-[200px] h-auto ml-auto"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreview;