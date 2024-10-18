import { FC } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ArrowLeft, ArrowRight, LayoutDashboard, ShoppingCart, Settings, ScrollText, UserPen, CircleUserRound, UserPlus, IdCard, UserRoundSearch, RotateCcw } from 'lucide-react'

interface GlobalContextMenuProps {
  children: React.ReactNode
}

const GlobalContextMenu: FC<GlobalContextMenuProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Employees', path: '/dashboard/employee', icon: UserPen }, 
    { label: 'Clients', path: '/dashboard/clients', icon: UserRoundSearch }, 
    { label: 'Categories', path: '/dashboard/categories', icon: ShoppingCart },
    { label: 'Invoices', path: '/dashboard/invoice', icon: ScrollText },
    { label: 'Profile', path: '/dashboard/profile', icon: CircleUserRound }, 
    { label: 'Profile Subscription', path: '/dashboard/profile-subscription', icon: UserPlus }, 
    { label: 'Payment Methods', path: '/dashboard/payment-methods', icon: IdCard },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    
  ];

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex-1">{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => navigate(-1)} disabled={location.pathname === '/'}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigate(1)}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Go Forward
        </ContextMenuItem>
        <ContextMenuItem onClick={() => window.location.reload()}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reload
        </ContextMenuItem>
        {menuItems.map((item) => (
          <ContextMenuItem key={item.path} onClick={() => navigate(item.path)}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default GlobalContextMenu