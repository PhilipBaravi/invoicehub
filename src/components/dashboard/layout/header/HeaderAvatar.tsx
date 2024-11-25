import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useAuth } from "@/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const HeaderAvatar: FC = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const menuItems = [
    {
      label: 'Team',
      path: 'employee',
      adminOnly: true
    },
    {
      label: 'Payment Method',
      path: 'settings/payment-methods',
      adminOnly: true
    },
    {
      label: 'Subscription',
      path: 'settings/profile-subscription',
      adminOnly: true
    },
    {
      label: 'Settings',
      path: 'settings',
      adminOnly: true
    }
  ];

  const logOut = () => {
    localStorage.removeItem('keycloak_token');
    localStorage.removeItem('keycloak_refresh_token');

    if (keycloak?.authenticated) {
      const redirectUri = `${window.location.origin}/login`;
      console.log('Logging out with redirect to:', redirectUri);
      
      keycloak.logout({
        redirectUri,
      }).then(() => {
        console.log('Logout completed');
        window.location.href = '/login';
      }).catch((error) => {
        console.error('Logout failed:', error);
        window.location.href = '/login';
      });
    } else {
      navigate('/login');
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.username || 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filteredMenuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <DropdownMenuItem>
              {item.label}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAvatar;