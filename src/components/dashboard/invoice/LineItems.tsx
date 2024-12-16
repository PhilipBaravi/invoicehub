import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { LineItem, Category, Product } from './invoice-types';
import { useTranslation } from 'react-i18next';

interface LineItemsProps {
  lineItems: LineItem[];
  handleAddLineItem: () => void;
  handleLineItemChange: (index: number, field: keyof LineItem, value: string | number) => void;
  handleRemoveLineItem: (index: number) => void;
  handleAddTaxes: (index: number) => void;
  handleItemSelect: (index: number, categoryId: number, productId: number) => void;
  categories: Category[];
  products: Product[];
  isEditMode: boolean;
  currencySymbol: string;
}

const LineItems: FC<LineItemsProps> = ({
  lineItems,
  handleAddLineItem,
  handleLineItemChange,
  handleRemoveLineItem,
  handleAddTaxes,
  handleItemSelect,
  categories,
  products,
  isEditMode,
  currencySymbol
}) => {
  const { t } = useTranslation('invoices');

  return (
    <div className="w-full space-y-4">
      <Label id='invoice-line-items-title' className="text-lg font-semibold">
        {t('invoice.lineItems.pageTitle')}
      </Label>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">{t('invoice.lineItems.category')}</th>
              <th className="p-2 text-left">{t('invoice.lineItems.product')}</th>
              <th className="p-2 text-left">{t('invoice.lineItems.price')}</th>
              <th className="p-2 text-left">{t('invoice.lineItems.quantity')}</th>
              <th className="p-2 text-center">{t('invoice.lineItems.lineTotal')}</th>
              <th className="p-2 text-center">{t('invoice.lineItems.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-2">
                  <Select
                    value={item.categoryId ? item.categoryId.toString() : undefined}
                    onValueChange={(value) => handleLineItemChange(index, 'categoryId', Number(value))}
                    disabled={isEditMode}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('invoice.lineItems.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()} id={`line-item-category${category.id.toString()}`}>
                          {category.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Select
                    value={item.itemId ? item.itemId.toString() : undefined}
                    onValueChange={(value) => handleItemSelect(index, item.categoryId, Number(value))}
                    disabled={!item.categoryId || isEditMode}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('invoice.lineItems.select')} id={`lineitem-item-select-invoice`} />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter((product) => product.category.id === item.categoryId)
                        .map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()} id={`line-items-product-${product.id.toString()}`}>
                            {product.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price.toFixed(2)}
                    onChange={(e) => {
                      const parsedValue = parseFloat(e.target.value);
                      handleLineItemChange(index, 'price', isNaN(parsedValue) ? 0 : parseFloat(parsedValue.toFixed(2)));
                    }}
                    id={`line-items-price${Math.random() * 999999 + 1}`}
                    className="w-full"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                    id={`line-items-quantity-${Math.random() * 999999 + 1}`}
                    className="w-full"
                  />
                </td>
                <td className="p-2 text-center font-bold">
                  {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="p-2">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="link" onClick={() => handleAddTaxes(index)} className="text-blue-700">
                      {t('invoice.lineItems.addTax')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveLineItem(index)} disabled={isEditMode}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {lineItems.map((item, index) => (
        <div key={`description-${index}`} className="mt-2">
          <Textarea
            placeholder={t('invoice.lineItems.enterDescription')}
            value={item.description}
            onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
            className="w-full"
            id={`lineitems-items-description${Math.random() + 99999 + 1}`}
          />
          {item.error && <p className="text-red-500 mt-1">{item.error}</p>}
        </div>
      ))}
      {!isEditMode && (
        <Button onClick={handleAddLineItem} className="mt-4">
          <PlusIcon className="mr-2 h-4 w-4" /> {t('invoice.lineItems.add')}
        </Button>
      )}
    </div>
  );
};

export default LineItems;

