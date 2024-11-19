import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Building2, CreditCard, User } from 'lucide-react'
import {
  Card,
  CardContent,
} from '@/components/ui/card'

const settingsNavItems = [
  { title: 'Company Settings', to: '', icon: Building2 },
  { title: 'Profile Subscription', to: 'profile-subscription', icon: User },
  { title: 'Payment Methods', to: 'payment-methods', icon: CreditCard },
]

const Settings: React.FC = () => {
  const location = useLocation()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-2 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <Card className="h-fit md:sticky md:top-8">
          <CardContent className="p-4">
            <nav className="flex flex-col space-y-1">
              {settingsNavItems.map((item) => {
                const isActive = location.pathname === `/settings/${item.to}`
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </CardContent>
        </Card>
<Outlet />
      </div>
    </div>
  )
}

export default Settings