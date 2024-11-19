import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Building2, CreditCard, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const settingsNavItems = [
  { title: 'Company Settings', to: '', icon: Building2 },
  { title: 'Profile Subscription', to: 'profile-subscription', icon: User },
  { title: 'Payment Methods', to: 'payment-methods', icon: CreditCard },
]

const Settings: React.FC = () => {
  const location = useLocation()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 w-full px-6">

    
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <Sidebar className="hidden lg:block">
          <SidebarHeader>
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Building2 className="h-6 w-6" />
              <span className="">Acme Inc</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {settingsNavItems.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={location.pathname === `/settings/${item.to}`}>
                        <Link to={item.to}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
            <Link to="/" className="lg:hidden">
              <Building2 className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold text-lg">Settings</h1>
            </div>
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-4 md:p-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {location.pathname === '/settings'
                    ? 'Update your company details'
                    : location.pathname === '/settings/profile-subscription'
                    ? 'Profile Subscription'
                    : 'Payment Methods'}
                </CardTitle>
                <CardDescription>
                  {location.pathname === '/settings'
                    ? 'Manage your company information and settings.'
                    : location.pathname === '/settings/profile-subscription'
                    ? 'View and manage your profile subscription.'
                    : 'Manage your payment methods and billing information.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {location.pathname === '/settings' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Update your company details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* The component for updating company details */}
                      <CompanySettingsForm />
                    </CardContent>
                  </Card>
                )}
                <Outlet />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </div>
  )
}

const CompanySettingsForm: React.FC = () => {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="company-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Company Name
        </label>
        <input
          id="company-name"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter company name"
        />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  )
}

export default Settings