import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { LineItem, Category, Product } from "./invoice-types";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeInVariants } from "@/utils/styling";
import React from "react";

interface LineItemsProps {
  lineItems: LineItem[];
  handleAddLineItem: () => void;
  handleLineItemChange: (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => void;
  handleRemoveLineItem: (index: number) => void;
  handleAddTaxes: (index: number) => void;
  handleItemSelect: (
    index: number,
    categoryId: number,
    productId: number
  ) => void;
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
  currencySymbol,
}) => {
  const { t } = useTranslation("invoices");

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Label
          id="invoice-line-items-title"
          className="text-xl font-semibold text-stone-800 dark:text-stone-100"
        >
          {t("invoice.lineItems.pageTitle")}
        </Label>
      </div>
      <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b-2 border-stone-200 dark:border-stone-700">
              <th className="p-4 text-left">
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  {t("invoice.lineItems.category")}
                </span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  {t("invoice.lineItems.product")}
                </span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  {t("invoice.lineItems.price")}
                </span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  {t("invoice.lineItems.quantity")}
                </span>
              </th>
              <th className="p-4 text-center">
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  {t("invoice.lineItems.lineTotal")}
                </span>
              </th>
              <th className="p-4 text-center">
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  {t("invoice.lineItems.actions")}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-stone-900">
            {lineItems.map((item, index) => (
              <React.Fragment key={index}>
                <motion.tr
                  className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="p-4">
                    <Select
                      value={
                        item.categoryId ? item.categoryId.toString() : undefined
                      }
                      onValueChange={(value) =>
                        handleLineItemChange(index, "categoryId", Number(value))
                      }
                      disabled={isEditMode}
                    >
                      <SelectTrigger className="w-full shadow-sm border-stone-200 dark:border-stone-700">
                        <SelectValue
                          placeholder={t("invoice.lineItems.selectCategory")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                            id={`line-item-category-${category.id}`}
                          >
                            {category.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <Select
                      value={item.itemId ? item.itemId.toString() : undefined}
                      onValueChange={(value) =>
                        handleItemSelect(index, item.categoryId, Number(value))
                      }
                      disabled={!item.categoryId || isEditMode}
                    >
                      <SelectTrigger className="w-full shadow-sm border-stone-200 dark:border-stone-700">
                        <SelectValue
                          placeholder={t("invoice.lineItems.select")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {products
                          .filter(
                            (product) => product.category.id === item.categoryId
                          )
                          .map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                              id={`line-items-product-${product.id}`}
                            >
                              {product.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price.toFixed(2)}
                      onChange={(e) => {
                        const parsedValue = parseFloat(e.target.value);
                        handleLineItemChange(
                          index,
                          "price",
                          isNaN(parsedValue)
                            ? 0
                            : parseFloat(parsedValue.toFixed(2))
                        );
                      }}
                      id={`line-items-price-${index}`}
                      className="shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
                    />
                  </td>
                  <td className="p-4">
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        handleLineItemChange(index, "quantity", e.target.value)
                      }
                      id={`line-items-quantity-${index}`}
                      className="shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {currencySymbol}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="link"
                        onClick={() => handleAddTaxes(index)}
                        className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                      >
                        {t("invoice.lineItems.addTax")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLineItem(index)}
                        disabled={isEditMode}
                        className="text-stone-600 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
                <motion.tr
                  className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 + 0.05 }}
                >
                  <td className="p-4" colSpan={6}>
                    <Textarea
                      placeholder={t("invoice.lineItems.enterDescription")}
                      value={item.description}
                      onChange={(e) =>
                        handleLineItemChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full shadow-sm border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
                      id={`lineitems-items-description-${index}`}
                    />
                    {item.error && (
                      <p className="text-red-500 dark:text-red-400 mt-2 text-sm">
                        {item.error}
                      </p>
                    )}
                  </td>
                </motion.tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {!isEditMode && (
        <Button
          onClick={handleAddLineItem}
          className="mt-4 flex items-center bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> {t("invoice.lineItems.add")}
        </Button>
      )}
    </div>
  );
};

export default LineItems;
