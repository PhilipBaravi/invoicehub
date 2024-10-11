import React, { useRef, FC } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Invoice: FC = () => {
  const contentRef = useRef<HTMLDivElement | null>(null); // Define contentRef for the element you want to print
  const [invoiceData, setInvoiceData] = React.useState({
    invoiceNumber: "",
    invoiceDate: "",
    sellerName: "",
    sellerAddress: "",
    sellerTIN: "",
    sellerContact: "",
    sellerBank: "",
    buyerName: "",
    buyerAddress: "",
    buyerTIN: "",
    buyerContact: "",
    items: [{ description: "", quantity: "", unitPrice: "", total: "" }],
    subtotal: "",
    vatRate: "18",
    vatAmount: "",
    totalAmount: "",
    paymentMethod: "",
    paymentDeadline: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: "", unitPrice: "", total: "" }],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  // Use react-to-print with contentRef
//   const reactToPrintFn = useReactToPrint({
//     content: () => contentRef.current,
//   });

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Invoice Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  name="invoiceDate"
                  type="date"
                  value={invoiceData.invoiceDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Seller Information</h3>
                <Input
                  placeholder="Business Name"
                  name="sellerName"
                  value={invoiceData.sellerName}
                  onChange={handleInputChange}
                />
                <Textarea
                  placeholder="Address"
                  name="sellerAddress"
                  value={invoiceData.sellerAddress}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Tax Identification Number (TIN)"
                  name="sellerTIN"
                  value={invoiceData.sellerTIN}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Contact Information"
                  name="sellerContact"
                  value={invoiceData.sellerContact}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Bank Details"
                  name="sellerBank"
                  value={invoiceData.sellerBank}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Buyer Information</h3>
                <Input
                  placeholder="Full Name / Business Name"
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
                  placeholder="Tax Identification Number (TIN)"
                  name="buyerTIN"
                  value={invoiceData.buyerTIN}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Contact Information"
                  name="buyerContact"
                  value={invoiceData.buyerContact}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Items</h3>
              {invoiceData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 mb-2">
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
                  <Button type="button" variant="destructive" onClick={() => removeItem(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addItem}>
                Add Item
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="vatRate">VAT Rate</Label>
                <Select onValueChange={(value) => handleSelectChange("vatRate", value)} value={invoiceData.vatRate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select VAT rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="0">0%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vatAmount">VAT Amount</Label>
                <Input
                  id="vatAmount"
                  name="vatAmount"
                  type="number"
                  value={invoiceData.vatAmount}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select onValueChange={(value) => handleSelectChange("paymentMethod", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentDeadline">Payment Deadline</Label>
                <Input
                  id="paymentDeadline"
                  name="paymentDeadline"
                  type="date"
                  value={invoiceData.paymentDeadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {/* <Button onClick={reactToPrintFn} className="w-full">
            Generate PDF
          </Button> */}
        </CardFooter>
      </Card>

      {/* Hidden invoice template for PDF generation */}
      <div className="hidden">
        <div ref={contentRef} className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6">INVOICE</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p>
                <strong>Invoice Number:</strong> {invoiceData.invoiceNumber}
              </p>
              <p>
                <strong>Invoice Date:</strong> {invoiceData.invoiceDate}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Seller</h2>
              <p>{invoiceData.sellerName}</p>
              <p>{invoiceData.sellerAddress}</p>
              <p>TIN: {invoiceData.sellerTIN}</p>
              <p>{invoiceData.sellerContact}</p>
              <p>{invoiceData.sellerBank}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Buyer</h2>
              <p>{invoiceData.buyerName}</p>
              <p>{invoiceData.buyerAddress}</p>
              <p>TIN: {invoiceData.buyerTIN}</p>
              <p>{invoiceData.buyerContact}</p>
            </div>
          </div>
          <table className="w-full mb-6">
            <thead>
              <tr>
                <th className="border p-2">Description</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Unit Price</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">{item.unitPrice}</td>
                  <td className="border p-2">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p>
                <strong>Subtotal:</strong> {invoiceData.subtotal}
              </p>
              <p>
                <strong>VAT Rate:</strong> {invoiceData.vatRate}%
              </p>
              <p>
                <strong>VAT Amount:</strong> {invoiceData.vatAmount}
              </p>
              <p>
                <strong>Total Amount Due:</strong> {invoiceData.totalAmount}
              </p>
            </div>
            <div>
              <p>
                <strong>Payment Method:</strong> {invoiceData.paymentMethod}
              </p>
              <p>
                <strong>Payment Deadline:</strong> {invoiceData.paymentDeadline}
              </p>
            </div>
          </div>
          <div className="mt-8">
            <p>Signature: _______________________</p>
            <p>Stamp: _______________________</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
