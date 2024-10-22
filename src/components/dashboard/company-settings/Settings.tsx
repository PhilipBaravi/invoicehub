import { Link, Outlet, useLocation } from "react-router-dom";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Settings: FC = () => {
  const location = useLocation();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <nav className="space-y-4 flex flex-col">
          <Link to="/settings" className="hover:underline">Company Settings</Link>
          <Link to="/settings/profile" className="hover:underline">Profile</Link>
          <Link to="/settings/profile-subscription" className="hover:underline">Profile Subscription</Link>
          <Link to="/settings/payment-methods" className="hover:underline">Payment Methods</Link>
        </nav>

        {/* Main content */}
        <div className="grid gap-6">
          {/* Only render UpdateCompanyDetails if the current path is exactly /settings */}
          {location.pathname === "/settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Update your company details</CardTitle>
              </CardHeader>
              <CardContent>
                {/* The component for updating company details */}
              </CardContent>
            </Card>
          )}

          {/* The Outlet will render nested routes such as Profile, ProfileSubscription, etc. */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;
