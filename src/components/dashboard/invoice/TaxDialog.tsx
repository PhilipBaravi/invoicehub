import { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TaxDialogProps {
  showTaxDialog: boolean;
  setShowTaxDialog: (open: boolean) => void;
  taxDetails: { percentage: number; name: string; number: string };
  setTaxDetails: (details: { percentage: number; name: string; number: string }) => void;
  applyTaxes: () => void;
}

const TaxDialog: FC<TaxDialogProps> = ({
  showTaxDialog,
  setShowTaxDialog,
  taxDetails,
  setTaxDetails,
  applyTaxes
}) => {
  return (
    <Dialog open={showTaxDialog} onOpenChange={setShowTaxDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Taxes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taxPercentage">Price (%)</Label>
            <Input
              id="taxPercentage"
              type="number"
              placeholder="0"
              value={taxDetails.percentage}
              onChange={(e) => setTaxDetails({ ...taxDetails, percentage: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="taxName">Tax Name</Label>
            <Input
              id="taxName"
              placeholder="Enter tax name"
              value={taxDetails.name}
              onChange={(e) => setTaxDetails({ ...taxDetails, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="taxNumber">Tax Number (Optional)</Label>
            <Input
              id="taxNumber"
              placeholder="Enter tax number"
              value={taxDetails.number}
              onChange={(e) => setTaxDetails({ ...taxDetails, number: e.target.value })}
            />
          </div>
          <Button className="w-full" onClick={applyTaxes}>Apply Taxes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxDialog;
