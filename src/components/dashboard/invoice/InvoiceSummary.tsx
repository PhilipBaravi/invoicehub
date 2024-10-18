import { FC } from "react"
import { InvoiceItem } from "./invoicetypes"

interface InvoiceSummaryProps {
  items: InvoiceItem[]
}

const InvoiceSummary: FC<InvoiceSummaryProps> = ({ items }) => {
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.qty, 0)
  }

  const calculateTaxTotal = () => {
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.qty
      return total + item.taxes.reduce((taxTotal, tax) => taxTotal + (itemTotal * tax.price) / 100, 0)
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxTotal()
  }

  return (
    <div className="flex justify-end">
      <div className="w-1/2">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>{calculateTaxTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default InvoiceSummary