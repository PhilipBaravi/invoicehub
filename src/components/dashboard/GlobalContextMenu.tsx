import { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  ShoppingCart,
  Settings,
  ScrollText,
  UserPen,
  UserPlus,
  IdCard,
  UserRoundSearch,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface GlobalContextMenuProps {
  children: React.ReactNode;
}

const GlobalContextMenu: FC<GlobalContextMenuProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("globalMenu");

  const menuItems = [
    { label: t("dashboard"), path: "/dashboard", icon: LayoutDashboard },
    { label: t("invoices"), path: "/dashboard/invoices", icon: ScrollText },
    { label: t("employees"), path: "/dashboard/employee", icon: UserPen },
    { label: t("clients"), path: "/dashboard/clients", icon: UserRoundSearch },
    {
      label: t("categories"),
      path: "/dashboard/categories",
      icon: ShoppingCart,
    },
    {
      label: t("subscription"),
      path: "/dashboard/settings/profile-subscription",
      icon: UserPlus,
    },
    {
      label: t("payment"),
      path: "/dashboard/settings/payment-methods",
      icon: IdCard,
    },
    { label: t("settings"), path: "/dashboard/settings", icon: Settings },
    { label: t("logOut"), path: "/login", icon: LogOut },
  ];

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex-1">{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={() => navigate(-1)}
          disabled={location.pathname === "/"}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigate(1)}>
          <ArrowRight className="mr-2 h-4 w-4" />
          {t("forward")}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => window.location.reload()}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {t("reload")}
        </ContextMenuItem>
        {menuItems.map((item) => (
          <ContextMenuItem key={item.path} onClick={() => navigate(item.path)}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GlobalContextMenu;
