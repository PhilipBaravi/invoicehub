import { FC } from "react";
import { Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useAuth } from "@/hooks/useAuth";
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
  const { t } = useTranslation("settings");

  const menuItems = [
    {
      label: t("menu.team"),
      path: "employee",
      adminOnly: true,
    },
    {
      label: t("menu.payment"),
      path: "settings/payment-methods",
      adminOnly: true,
    },
    {
      label: t("menu.subscription"),
      path: "settings/profile-subscription",
      adminOnly: true,
    },
    {
      label: t("menu.settings"),
      path: "settings",
      adminOnly: true,
    },
  ];

  const logOut = async () => {
    if (!keycloak) return;

    const idToken = keycloak.idToken;
    const postLogoutRedirectUri = "http://localhost:5173/";

    if (!idToken) {
      console.error(
        "No id_token available to send as id_token_hint. Check Keycloak configuration or ensure a full login occurred."
      );
      return;
    }

    const logoutUrl = `${keycloak.authServerUrl}/realms/${
      keycloak.realm
    }/protocol/openid-connect/logout?id_token_hint=${encodeURIComponent(
      idToken
    )}&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;

    // Clear tokens
    localStorage.removeItem("keycloak_token");
    localStorage.removeItem("keycloak_refresh_token");
    localStorage.removeItem("keycloak_id_token");

    window.location.href = logoutUrl;
  };

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.username || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filteredMenuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <DropdownMenuItem>{item.label}</DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut} className="cursor-pointer">
          {t("menu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAvatar;
