import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";  // Import useKeycloak hook
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
  const { keycloak } = useKeycloak();  // Get the keycloak instance
  const navigate = useNavigate();

  const logOut = () => {
    if (keycloak?.authenticated) {
      keycloak.logout({ redirectUri: window.location.origin + "/login" }); // Log out and redirect
    } else {
      // If Keycloak is not initialized or already logged out, simply navigate
      navigate('/login');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">shadcn</p>
            <p className="text-xs leading-none text-muted-foreground">
              m@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="employee">
          <DropdownMenuItem>
            Team
          </DropdownMenuItem>
        </Link>
        <Link to="settings/payment-methods">
          <DropdownMenuItem>
            Payment Method
          </DropdownMenuItem>
        </Link>
        <Link to="settings/profile-subscription">
          <DropdownMenuItem>
            Subscription
          </DropdownMenuItem>
        </Link>
        <Link to="settings">
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAvatar;
