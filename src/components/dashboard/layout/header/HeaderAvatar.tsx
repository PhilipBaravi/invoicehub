import { FC } from "react";
import { Link } from "react-router-dom";
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
import { useTranslation } from "react-i18next";

const HeaderAvatar: FC = () => {
  const { keycloak } = useKeycloak();
  const { isAdmin, user } = useAuth();
  const { t } = useTranslation('settings')

  const menuItems = [
    {
      label: t('menu.team'),
      path: 'employee',
      adminOnly: true
    },
    {
      label: t('menu.payment'),
      path: 'settings/payment-methods',
      adminOnly: true
    },
    {
      label: t('menu.subscription'),
      path: 'settings/profile-subscription',
      adminOnly: true
    },
    {
      label: t('menu.settings'),
      path: 'settings',
      adminOnly: true
    }
  ];

  const logOut = () => {
    keycloak.logout({
      redirectUri: 'http://localhost:5173/login', // Specify the redirect URI
    }).then(() => {
      // Clear tokens stored in localStorage
      localStorage.removeItem('keycloak_token');
      localStorage.removeItem('keycloak_refresh_token');
      // Optional: Confirm logout by reloading the page
      window.location.href = 'http://localhost:5173/login';
    }).catch(err => {
      console.error('Logout failed:', err);
    });
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
          {t('menu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAvatar;