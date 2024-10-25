import { FC } from 'react';
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface NotesTermsProps {
  invoice: any;
  setInvoice: any;
}

const NotesTerms: FC<NotesTermsProps> = ({ invoice, setInvoice }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Enter notes (optional)"
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes:  e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="terms">Terms</Label>
        <Textarea
          id="terms"
          placeholder="Enter your terms and conditions"
          value={invoice.terms}
          onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
        />
      </div>
    </div>
  );
};

export default NotesTerms;
