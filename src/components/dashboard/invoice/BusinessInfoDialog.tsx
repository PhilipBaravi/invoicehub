import { FC, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { BusinessInfo } from "./invoicetypes"

interface BusinessInfoDialogProps {
  businessInfo: BusinessInfo
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>
}

const BusinessInfoDialog: FC<BusinessInfoDialogProps> = ({
  businessInfo,
  setBusinessInfo,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localBusinessInfo, setLocalBusinessInfo] = useState<BusinessInfo>(businessInfo)

  const handleApplyChanges = () => {
    setBusinessInfo(localBusinessInfo)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-500 p-0">
          Edit Business Information
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Business Information</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={localBusinessInfo.name}
              onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={localBusinessInfo.phone}
              onChange={(e) => setLocalBusinessInfo({ ...localBusinessInfo, phone: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showPhone"
              checked={localBusinessInfo.showPhone}
              onCheckedChange={(checked) => setLocalBusinessInfo({ ...localBusinessInfo, showPhone: checked as boolean })}
            />
            <Label htmlFor="showPhone">Show phone number</Label>
          </div>
          {/* Add more fields for address, tax information, etc. */}
          <Button type="submit" onClick={handleApplyChanges}>
            Apply Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default BusinessInfoDialog