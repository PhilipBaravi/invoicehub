import { Link } from "react-router-dom"
import { FC } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import UpdateCompanyDetails from "./UpdateCompanyDetails"

const Settings: FC = () => {

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <nav className="space-y-4 flex flex-col">
          <Link to="/settings" className="hover:underline">Company Settings</Link>
          <Link to="/dashboard" className="hover:underline">Admin Settings</Link>
          <Link to="/dashboard" className="hover:underline">Support</Link>
          <Link to="/dashboard" className="hover:underline">Organizations</Link>
          <Link to="/dashboard" className="hover:underline">Advanced</Link>
        </nav>

        {/* Main content */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Update your company details</CardTitle>
            </CardHeader>
            <CardContent>
            <UpdateCompanyDetails />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings;
