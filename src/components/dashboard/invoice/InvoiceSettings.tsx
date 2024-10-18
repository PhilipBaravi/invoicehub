import { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const InvoiceSettings: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <p className="text-sm text-gray-500">For This Invoice</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Accept Online Payments</span>
          <span>NO</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Customize Invoice Style</span>
          <span>{">"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Send Reminders</span>
          <span>NO</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Change Late Fees</span>
          <span>NO</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Currency & Language</span>
          <span>{">"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Invoice Attachments</span>
          <span>NO</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default InvoiceSettings