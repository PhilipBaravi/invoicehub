import { FC, Fragment } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from "lucide-react"
import { InvoiceItem, Tax } from "./invoicetypes"
import AddTaxDialog from "./AddTaxDIalog"

interface InvoiceItemsProps {
  items: InvoiceItem[]
  updateItem: (id: number, field: keyof InvoiceItem, value: string | number) => void
  deleteItem: (id: number) => void
  addItem: () => void
  addTaxToItem: (itemId: number, tax: Tax) => void
}

const InvoiceItems: FC<InvoiceItemsProps> = ({
  items,
  updateItem,
  deleteItem,
  addItem,
  addTaxToItem,
}) => {
  return (
    <div className="mb-4">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left pb-2">Description</th>
            <th className="text-left pb-2">Price</th>
            <th className="text-left pb-2">Quantity</th>
            <th className="text-center pb-2">Line Total</th>
            <th className="text-center pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <Fragment key={item.id}>
              <tr className="border-b">
                <td className="py-2">
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="Enter an Item Name"
                  />
                </td>
                <td className="py-2">
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", e.target.value)}
                    className="text-center"
                  />
                </td>
                <td className="py-2">
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                    className="text-center"
                  />
                </td>
                <td className="py-2 text-right">{(item.price * item.qty).toFixed(2)}</td>
                <td className="py-2 text-right">
                  <AddTaxDialog itemId={item.id} addTaxToItem={addTaxToItem} />
                  <Button variant="ghost" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2" colSpan={5}>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="Enter an Item Description"
                  />
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
      <Button variant="outline" className="mt-2" onClick={addItem}>
        <PlusCircle className="w-4 h-4 mr-2" /> Add Item
      </Button>
    </div>
  )
}

export default InvoiceItems