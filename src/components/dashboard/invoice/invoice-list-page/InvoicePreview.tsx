import { FC, useEffect, useState, Fragment } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Invoice, InvoiceProduct } from '../invoice-types';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import { Description, DialogTitle } from '@radix-ui/react-dialog';

interface InvoicePreviewProps {
invoice: Invoice;
isOpen: boolean;
onClose: () => void;
}

const currencyIcons: Record<string, string> = {
'USD': '$',
'EUR': '€',
'GEL': '₾',
};

const InvoicePreview: FC<InvoicePreviewProps> = ({
invoice,
isOpen,
onClose,
}) => {
const [lineItems, setLineItems] = useState<InvoiceProduct[]>([]);
const [businessInfo, setBusinessInfo] = useState<any>(null);
const { keycloak } = useKeycloak();
const { t } = useTranslation('invoices');

const currencyIcon = currencyIcons[invoice.currency] || '';

useEffect(() => {
const fetchLineItems = async () => {
try {
const response = await fetch(`https://api.invoicehub.space/api/v1/invoice/product/list/${invoice.id}`, {
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


const fetchBusinessInfo = async () => {
  try {
    const response = await fetch('https://api.invoicehub.space/api/v1/user/loggedInUser', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    const result = await response.json();
    if (result.success) {
      setBusinessInfo(result.data.company);
      console.log(businessInfo)
    }
  } catch (error) {
    console.error('Error fetching business information:', error);
  }
};

if (isOpen && invoice.id) {
  fetchLineItems();
  fetchBusinessInfo();
}
}, [isOpen, invoice.id, keycloak.token]);

return (
<Dialog open={isOpen} onOpenChange={onClose}>
<Description></Description>
<DialogContent className="max-w-4xl w-full sm:w-[95vw] md:w-[90vw] lg:w-full">
<DialogTitle className='hidden'>Preview Invoice</DialogTitle>
<ScrollArea className="h-[90vh] w-full rounded-md p-2 sm:p-4">
<div className="max-w-[800px] mx-auto bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 lg:p-8">
{/* Header Section */}
<div className="flex flex-row mb-6 sm:mb-8 md:mb-10 lg:mb-12">
  <div className="w-3/5">
    <h1 className="text-xl sm:text-2xl md:text-3xl text-[#5c6ac4] mb-4">{t('invoice.pdf.invoice')}</h1>
    <p className="mb-2 text-[#94a3b8] text-xs sm:text-sm md:text-base">{t('invoiceList.invoiceNo')} {invoice.invoiceNo}</p>
    <p className="mb-2 text-[#94a3b8] text-xs sm:text-sm md:text-base">{t('invoice.pdf.dateIssue')} {new Date(invoice.dateOfIssue!).toLocaleDateString()}</p>
    <p className="mb-2 text-[#94a3b8] text-xs sm:text-sm md:text-base">{t('invoice.pdf.dueDate')} {new Date(invoice.dueDate!).toLocaleDateString()}</p>
  </div>
  <div className="w-2/5 text-right">
    <img
      src="https://raw.githubusercontent.com/templid/email-templates/main/templid-dynamic-templates/invoice-02/brand-sample.png"
      alt="Company Logo"
      className="w-24 sm:w-32 md:w-40 h-auto ml-auto"
    />
  </div>
</div>


        {/* Products Table */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
            <thead>
              <tr>
                <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.category')}</th>
                <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.product')}</th>
                <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.price')}</th>
                <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.quantity')}</th>
                <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.totals.tax')}</th>
                <th className="py-3 px-3 text-left bg-white font-bold text-[#5c6ac4] border-b-2 border-[#5c6ac4]">{t('invoice.lineItems.lineTotal')}</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <Fragment key={item.id}>
                  <tr>
                    <td className="py-3 px-3 text-left border-b border-[#e5e7eb]">{item.product.category.description}</td>
                    <td className="py-3 px-3 text-left border-b border-[#e5e7eb]">{item.product.name}</td>
                    <td className="py-3 px-3 text-left border-b border-[#e5e7eb]">
                      {currencyIcon}{item.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-left border-b border-[#e5e7eb]">{item.quantity}</td>
                    <td className="py-3 px-3 text-left border-b border-[#e5e7eb]">
                      {currencyIcon}{item.tax.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-left border-b border-[#e5e7eb]">
                      {currencyIcon}{item.total.toFixed(2)}
                    </td>
                  </tr>
                  <tr key={`desc-${item.id}`}>
                    <td colSpan={6} className="py-3 px-3 text-left border-b border-[#e5e7eb] bg-[#f9f9f9] text-stone-950">
                      {t('invoice.lineItems.description')} <span>{item.product.description}</span>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes, Terms, and Totals Section */}
        <div className="flex flex-row mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="w-3/5 pr-2 sm:pr-4 md:pr-6">
            <div className="mb-4">
              <div className="bg-[#f1f5f9] p-3 sm:p-4 md:p-6 rounded-lg">
                <h3 className="text-[#5c6ac4] mb-2 sm:mb-4 text-base sm:text-lg font-bold">{t('invoice.notesTerms.pageTitle')}</h3>
                <p className="text-stone-950 text-xs sm:text-sm">{invoice.notes}</p>
              </div>
            </div>
            <div>
              <div className="bg-[#f1f5f9] p-3 sm:p-4 md:p-6 rounded-lg">
                <h3 className="text-[#5c6ac4] mb-2 sm:mb-4 text-base sm:text-lg font-bold">{t('invoice.notesTerms.terms')}</h3>
                <p className="text-stone-950 text-xs sm:text-sm">{invoice.paymentTerms}</p>
              </div>
            </div>
          </div>
          <div className="w-2/5 pl-2 sm:pl-4 md:pl-6">
            <div className="bg-[#f1f5f9] rounded-lg">
              <div className="p-2 sm:p-3 md:px-6 border-b border-[#e5e7eb]">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#94a3b8]">{t('invoice.totals.subtotal')}</span>
                  <span className="text-[#5c6ac4] font-bold">{currencyIcon}{invoice.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-2 sm:p-3 md:px-6 border-b border-[#e5e7eb]">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#94a3b8]">{t('invoice.totals.tax')}</span>
                  <span className="text-[#5c6ac4] font-bold">{currencyIcon}{invoice.tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-2 sm:p-3 md:px-6 bg-[#5c6ac4] rounded-b-lg">
                <div className="flex justify-between text-xs sm:text-sm md:text-base">
                  <span className="text-white font-bold">{t('invoice.totals.total')}</span>
                  <span className="text-white font-bold">{currencyIcon}{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information Section */}
        <div className="flex flex-row mb-6 sm:mb-8 md:mb-10 lg:mb-12 justify-between items-start">
          <div className="w-1/2 pr-2 sm:pr-4 md:pr-6">
            <h2 className="text-[#5c6ac4] mb-2 sm:mb-4 text-base sm:text-lg font-bold">
              {t('invoice.pdf.bill')}
            </h2>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
              <strong>{t('invoice.pdf.name')}</strong> {invoice.clientVendor?.name}
            </p>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
              <strong>{t('invoice.pdf.phone')}</strong> {invoice.clientVendor?.phone}
            </p>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
              <strong>{t('invoice.pdf.website')}</strong> {invoice.clientVendor?.website}
            </p>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
              <strong>{t('invoice.email')}</strong> {invoice.clientVendor?.email}
            </p>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
              <strong>{t('invoice.pdf.country')}</strong> {invoice.clientVendor?.address.country}
            </p>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
              <strong>{t('invoice.pdf.city')}</strong> {invoice.clientVendor?.address.city}
            </p>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
              <strong>{t('invoice.pdf.address')}</strong> {invoice.clientVendor?.address.addressLine1}
            </p>
          </div>
          <div className="w-1/2 pl-2 sm:pl-4 md:pl-6 text-right">
            <h2 className="text-[#5c6ac4] mb-2 sm:mb-4 text-base sm:text-lg font-bold">
              {t('invoice.pdf.businessInfo')}
            </h2>
            {businessInfo ? (
              <div>
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
                  <strong>{t('invoice.pdf.name')}</strong> {businessInfo.title}
                </p>
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
                  <strong>{t('invoice.pdf.phone')}</strong> {businessInfo.phone}
                </p>
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
                  <strong>{t('invoice.pdf.website')}</strong> {businessInfo.website}
                </p>
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
                  <strong>{t('invoice.email')}</strong> {businessInfo.email}
                </p>
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
                  <strong>{t('invoice.country')}</strong> {businessInfo.address.country}
                </p>
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
                  <strong>{t('invoice.city')}</strong> {businessInfo.address.city}
                </p>
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-[#525252]">
                  <strong>{t('invoice.address')}</strong> {businessInfo.address.addressLine1}
                </p>
              </div>
            ) : (
              <p className="text-red-500 text-xs sm:text-sm">{t('invoice.errors.businessInfoNotFound')}</p>
            )}
          </div>
        </div>

        {/* Signature Section */}
        <div className="flex flex-row">
          <div className="w-1/2 pr-2 sm:pr-4 md:pr-6">
            <h3 className="text-[#5c6ac4] mb-2 sm:mb-4 text-base sm:text-lg font-bold">{t('invoice.pdf.clientSignature')}</h3>
            <div className="mt-2 sm:mt-4 p-2 sm:p-4 border-b border-[#e5e7eb]">
              {invoice.clientSignature && (
                <img
                  src={invoice.clientSignature}
                  alt="Client Signature"
                  className="max-w-[120px] sm:max-w-[160px] md:max-w-xs h-auto"
                />
              )}
            </div>
          </div>
          <div className="w-1/2 pl-2 sm:pl-4 md:pl-6 text-right">
            <h3 className="text-[#5c6ac4] mb-2 sm:mb-4 text-base sm:text-lg font-bold">{t('invoice.pdf.businessSignature')}</h3>
            <div className="mt-2 sm:mt-4 p-2 sm:p-4 border-b border-[#e5e7eb]">
              {invoice.businessSignature && (
                <img
                  src={invoice.businessSignature}
                  alt="Business Signature"
                  className="max-w-[120px] sm:max-w-[160px] md:max-w-xs h-auto ml-auto"
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

