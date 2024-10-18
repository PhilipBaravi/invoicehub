import { FC, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tax } from "./invoicetypes"

interface AddTaxDialogProps {
  itemId: number
  addTaxToItem: (itemId: number, tax: Tax) => void
}

 const AddTaxDialog: FC<AddTaxDialogProps> = ({ itemId, addTaxToItem }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tax, setTax] = useState<Tax>({ price: 0, name: "", number: "" })

  const handleAddTax = () => {
    addTaxToItem(itemId, tax)
    setTax({ price: 0, name: "", number: "" })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-500 p-0">
          Add Taxes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Taxes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taxprice">price (%)</Label>
            <Input
              id="taxprice"
              type="number"
              value={tax.price}
              onChange={(e) => setTax({ ...tax, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="taxName">Tax Name</Label>
            <Input
              id="taxName"
              value={tax.name}
              onChange={(e) => setTax({ ...tax, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="taxNumber">Tax Number (Optional)</Label>
            <Input
              id="taxNumber"
              value={tax.number}
              onChange={(e) => setTax({ ...tax, number: e.target.value })}
            />
          </div>
          <Button onClick={handleAddTax}>Apply Taxes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddTaxDialog