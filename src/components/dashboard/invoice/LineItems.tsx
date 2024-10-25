import { FC } from 'react';
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { LineItem, predefinedItems } from './predefinedItems'

interface LineItemsProps {
  lineItems: LineItem[];
  handleAddLineItem: () => void;
  handleLineItemChange: (index: number, field: keyof LineItem, value: string | number) => void;
  handleRemoveLineItem: (index: number) => void;
  handleAddTaxes: (index: number) => void;
  handleItemSelect: (index: number, itemId: string) => void;
}

const LineItems: FC<LineItemsProps> = ({
  lineItems,
  handleAddLineItem,
  handleLineItemChange,
  handleRemoveLineItem,
  handleAddTaxes,
  handleItemSelect
}) => {
  return (
    <div>
      <Label>Line Items</Label>
      <div>
        <table className="w-full mb-2">
          <thead>
            <tr>
              <th className="text-left w-[20%]">Item</th>
              <th className="text-left w-[20%]">Name</th>
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
                  <Select onValueChange={(value) => handleItemSelect(index, value)}>
                    <SelectTrigger className="w-[20%] mr-2">
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedItems.map((predefinedItem) => (
                        <SelectItem key={predefinedItem.id} value={predefinedItem.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{predefinedItem.name}</span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="link">Nested Options</Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48">
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose nested option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={`${predefinedItem.id}-nestedOption1`}>
                                      Nested Option 1 for {predefinedItem.name}
                                    </SelectItem>
                                    <SelectItem value={`${predefinedItem.id}-nestedOption2`}>
                                      Nested Option 2 for {predefinedItem.name}
                                    </SelectItem>
                                    <SelectItem value={`${predefinedItem.id}-nestedOption3`}>
                                      Nested Option 3 for {predefinedItem.name}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    className="w-[20%] mr-2"
                    placeholder="Enter an Item Name"
                    value={item.name}
                    onChange={(e) => handleLineItemChange(index, 'name', e.target.value)}
                  />
                  <Input
                    className="w-[15%] mr-2"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                  />
                  <Input
                    className="w-[15%] mr-2"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                  />
                  <div className="w-[15%] mr-2 flex items-center justify-center font-bold">
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="w-[15%] flex items-center justify-center">
                    <Button variant="link" onClick={() => handleAddTaxes(index)} className="mr-2 text-blue-700">Add Taxes</Button>
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