import { FC } from "react";
import { InvoiceData } from "./invoicetypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type InvoiceFormProps = {
  invoiceData: InvoiceData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleItemChange: (index: number, field: string, value: string) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
};

const InvoiceForm: FC<InvoiceFormProps> = ({
  invoiceData,
  handleInputChange,
  handleSelectChange,
  handleItemChange,
  addItem,
  removeItem,
}) => (
  <form className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <Input
          id="invoiceNumber"
          name="invoiceNumber"
          value={invoiceData.invoiceNumber}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="issueDate">Issue Date</Label>
        <Input
          id="issueDate"
          name="issueDate"
          type="date"
          value={invoiceData.issueDate}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={invoiceData.dueDate}
          onChange={handleInputChange}
        />
      </div>
    </div>

    <Separator />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Seller Information</h3>
        <Input
          placeholder="Company Name"
          name="sellerName"
          value={invoiceData.sellerName}
          onChange={handleInputChange}
        />
        <Textarea
          placeholder="Company Address"
          name="sellerAddress"
          value={invoiceData.sellerAddress}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Contact Number"
          name="sellerContact"
          value={invoiceData.sellerContact}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Email"
          name="sellerEmail"
          type="email"
          value={invoiceData.sellerEmail}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Tax Identification Number (TIN)"
          name="sellerTIN"
          value={invoiceData.sellerTIN}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Buyer Information</h3>
        <Input
          placeholder="Customer Name / Company Name"
          name="buyerName"
          value={invoiceData.buyerName}
          onChange={handleInputChange}
        />
        <Textarea
          placeholder="Address"
          name="buyerAddress"
          value={invoiceData.buyerAddress}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Contact Number"
          name="buyerContact"
          value={invoiceData.buyerContact}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Email"
          name="buyerEmail"
          type="email"
          value={invoiceData.buyerEmail}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Tax Identification Number (TIN)"
          name="buyerTIN"
          value={invoiceData.buyerTIN}
          onChange={handleInputChange}
        />
      </div>
    </div>

    <Separator />

    <div>
      <h3 className="font-semibold text-lg mb-4">Items</h3>
      {invoiceData.items.map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 mb-4">
          <Input
            placeholder="Description"
            value={item.description}
            onChange={(e) => handleItemChange(index, "description", e.target.value)}
          />
          <Input
            placeholder="Quantity"
            type="number"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
          />
          <Input
            placeholder="Unit Price"
            type="number"
            value={item.unitPrice}
            onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
          />
          <Input
            placeholder="Total"
            type="number"
            value={item.total}
            onChange={(e) => handleItemChange(index, "total", e.target.value)}
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => removeItem(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addItem} className="mt-2">
        Add Item
      </Button>
    </div>

    <Separator />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="subtotal">Subtotal</Label>
        <Input
          id="subtotal"
          name="subtotal"
          type="number"
          value={invoiceData.subtotal}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="taxType">Tax Type</Label>
        <Select
          onValueChange={(value) => handleSelectChange("taxType", value)}
          value={invoiceData.taxType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select tax type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VAT">VAT</SelectItem>
            <SelectItem value="Sales Tax">Sales Tax</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="taxRate">Tax Rate (%)</Label>
        <Input
          id="taxRate"
          name="taxRate"
          type="number"
          value={invoiceData.taxRate}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="taxAmount">Tax Amount</Label>
        <Input
          id="taxAmount"
          name="taxAmount"
          type="number"
          value={invoiceData.taxAmount}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="discountDescription">Discount Description</Label>
        <Input
          id="discountDescription"
          name="discountDescription"
          value={invoiceData.discountDescription}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="discountAmount">Discount Amount</Label>
        <Input
          id="discountAmount"
          name="discountAmount"
          type="number"
          value={invoiceData.discountAmount}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="totalAmount">Total Amount Due</Label>
        <Input
          id="totalAmount"
          name="totalAmount"
          type="number"
          value={invoiceData.totalAmount}
          onChange={handleInputChange}
        />
      </div>
    </div>

    <Separator />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="paymentMethods">Payment Methods</Label>
        <Input
          id="paymentMethods"
          name="paymentMethods"
          value={invoiceData.paymentMethods}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="paymentInstructions">Payment Instructions</Label>
        <Textarea
          id="paymentInstructions"
          name="paymentInstructions"
          value={invoiceData.paymentInstructions}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="lateFee">Late Fee Policy</Label>
        <Input
          id="lateFee"
          name="lateFee"
          value={invoiceData.lateFee}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={invoiceData.notes}
          onChange={handleInputChange}
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="termsConditions">Terms and Conditions</Label>
        <Textarea
          id="termsConditions"
          name="termsConditions"
          value={invoiceData.termsConditions}
          onChange={handleInputChange}
        />
      </div>
    </div>
  </form>
);

export default InvoiceForm;
