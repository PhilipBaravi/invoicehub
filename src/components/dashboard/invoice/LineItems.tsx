import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { LineItem, Category, Product } from './invoice-types';

interface LineItemsProps {
  lineItems: LineItem[];
  handleAddLineItem: () => void;
  handleLineItemChange: (index: number, field: keyof LineItem, value: string | number) => void;
  handleRemoveLineItem: (index: number) => void;
  handleAddTaxes: (index: number) => void;
  handleItemSelect: (index: number, categoryId: number, productId: number) => void;
  categories: Category[];
  products: Product[];
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
}) => {
  return (
    <div>
      <Label>Line Items</Label>
      <div>
        <table className="w-full mb-2">
          <thead>
            <tr>
              <th className="text-left w-[20%]">Category</th>
              <th className="text-left w-[20%]">Product</th>
              <th className="text-left w-[15%]">Price</th>
              <th className="text-left w-[15%]">Quantity</th>
              <th className="text-center w-[15%]">Line Total</th>
              <th className="w-[15%]">Actions</th>
            </tr>
          </thead>
        </table>
        {lineItems.length === 0 ? (
          <Button onClick={handleAddLineItem} className="mb-4">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Item
          </Button>
        ) : (
          <div>
            {lineItems.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex mb-2">
                  <Select
                    value={item.categoryId ? item.categoryId.toString() : undefined}
                    onValueChange={(value) => handleLineItemChange(index, 'categoryId', Number(value))}
                  >
                    <SelectTrigger className="w-[20%] mr-2">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={item.itemId ? item.itemId.toString() : undefined}
                    onValueChange={(value) => handleItemSelect(index, item.categoryId, Number(value))}
                    disabled={!item.categoryId}
                  >
                    <SelectTrigger className="w-[20%] mr-2">
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter((product) => product.category.id === item.categoryId)
                        .map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Input
                    className="w-[15%] mr-2"
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                  />
                  <Input
                    className="w-[15%] mr-2"
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                  />
                  <div className="w-[15%] mr-2 flex items-center justify-center font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="w-[15%] flex items-center justify-center">
                    <Button variant="link" onClick={() => handleAddTaxes(index)} className="mr-2 text-blue-700">
                      Add Taxes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveLineItem(index)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Enter an Item Description"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                  className="w-full"
                />
                {item.error && <p className="text-red-500">{item.error}</p>}
              </div>
            ))}
            <Button onClick={handleAddLineItem} className="mt-2">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineItems;
