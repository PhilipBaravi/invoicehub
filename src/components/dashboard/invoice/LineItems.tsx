import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { LineItem, Category, Product } from './invoice-types';
import { useTranslation } from 'react-i18next';
import React from 'react';

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
    <div className="w-full space-y-6">
      <Label id='invoice-line-items-title' className="text-lg font-semibold text-stone-900 dark:text-stone-100">
        {t('invoice.lineItems.pageTitle')}
      </Label>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-stone-200 dark:bg-stone-950">
              <th className="p-3 text-left text-stone-700 dark:text-stone-300">{t('invoice.lineItems.category')}</th>
              <th className="p-3 text-left text-stone-700 dark:text-stone-300">{t('invoice.lineItems.product')}</th>
              <th className="p-3 text-left text-stone-700 dark:text-stone-300">{t('invoice.lineItems.price')}</th>
              <th className="p-3 text-left text-stone-700 dark:text-stone-300">{t('invoice.lineItems.quantity')}</th>
              <th className="p-3 text-center text-stone-700 dark:text-stone-300">{t('invoice.lineItems.lineTotal')}</th>
              <th className="p-3 text-center text-stone-700 dark:text-stone-300">{t('invoice.lineItems.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="border-b border-stone-300 dark:border-stone-700">
                  <td className="p-3">
                    <Select
                      value={item.categoryId ? item.categoryId.toString() : undefined}
                      onValueChange={(value) => handleLineItemChange(index, 'categoryId', Number(value))}
                      disabled={isEditMode}
                    >
                      <SelectTrigger className="w-full bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-600 rounded-md">
                        <SelectValue placeholder={t('invoice.lineItems.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-600 rounded-md">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()} id={`line-item-category-${category.id}`}>
                            {category.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Select
                      value={item.itemId ? item.itemId.toString() : undefined}
                      onValueChange={(value) => handleItemSelect(index, item.categoryId, Number(value))}
                      disabled={!item.categoryId || isEditMode}
                    >
                      <SelectTrigger className="w-full bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-600 rounded-md">
                        <SelectValue placeholder={t('invoice.lineItems.select')} />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-600 rounded-md">
                        {products
                          .filter((product) => product.category.id === item.categoryId)
                          .map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()} id={`line-items-product-${product.id}`}>
                              {product.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price.toFixed(2)}
                      onChange={(e) => {
                        const parsedValue = parseFloat(e.target.value);
                        handleLineItemChange(index, 'price', isNaN(parsedValue) ? 0 : parseFloat(parsedValue.toFixed(2)));
                      }}
                      id={`line-items-price-${index}`}
                      className="w-full bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-600 rounded-md"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                      id={`line-items-quantity-${index}`}
                      className="w-full bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-600 rounded-md"
                    />
                  </td>
                  <td className="p-3 text-center font-bold text-stone-900 dark:text-stone-100">
                    {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="link"
                        onClick={() => handleAddTaxes(index)}
                        className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        {t('invoice.lineItems.addTax')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLineItem(index)}
                        disabled={isEditMode}
                        className="text-stone-700 dark:text-stone-300 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-stone-300 dark:border-stone-700">
                  <td className="p-3" colSpan={6}>
                    <Textarea
                      placeholder={t('invoice.lineItems.enterDescription')}
                      value={item.description}
                      onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-600 rounded-md"
                      id={`lineitems-items-description-${index}`}
                    />
                    {item.error && <p className="text-red-500 dark:text-red-400 mt-1">{item.error}</p>}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {!isEditMode && (
        <Button
          onClick={handleAddLineItem}
          className="mt-4 flex items-center bg-stone-200 dark:bg-stone-600 text-stone-800 dark:text-stone-100 hover:bg-stone-300 dark:hover:bg-stone-500"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> {t('invoice.lineItems.add')}
        </Button>
      )}
    </div>
  );
};

export default LineItems;
