import { FC } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const InvoiceNotes: FC = () => {
  return (
    <>
      <div className="mt-4">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Enter notes or bank transfer details (optional)" />
      </div>
      <div className="mt-4">
        <Label htmlFor="terms">Terms</Label>
        <Textarea
          id="terms"
          placeholder="Enter your terms and conditions. (Pro tip: It pays to be polite. Invoices that include 'please' and 'thanks' get paid up to 2 days faster.)"
        />
      </div>
    </>
  )
}

export default InvoiceNotes