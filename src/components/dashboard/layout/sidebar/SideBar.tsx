import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { PanelRightOpen, LayoutDashboard, UserSearch, FolderKanban, LogIn, Building2, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/useAuth";
import { useKeycloak } from "@react-keycloak/web";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: FC<SideBarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboardDefault");
  const { isAdmin } = useAuth();
  const { keycloak } = useKeycloak();
  
  const menuItems = [
    { 
      name: t("sidebar.dashboard"), 
      icon: LayoutDashboard, 
      path: "/dashboard",
      showAlways: true
    },
    { 
      name: t("sidebar.invoice"), 
      icon: FileText, 
      path: "/dashboard/invoices",
      showAlways: true
    },
    { 
      name: t("sidebar.employee"), 
      icon: UserSearch, 
      path: "/dashboard/employee",
      adminOnly: true
    },
    { 
      name: t("sidebar.clients"), 
      icon: Building2, 
      path: "/dashboard/clients",
      showAlways: true
    },
    { 
      name: t("sidebar.categories"), 
      icon: FolderKanban, 
      path: "/dashboard/categories",
      showAlways: true
    },
    { 
      name: t("sidebar.login"), 
      icon: LogIn, 
      path: "/login",
      showAlways: true
    },
  ];

  const handleItemClick = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (path === "/login") {
      handleLogout();
    } else {
      navigate(path);
      onClose();
    }
  };

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: 'http://invoicehub.space/login', // Specify the redirect URI
    }).then(() => {
      // Clear tokens stored in localStorage
      localStorage.removeItem('keycloak_token');
      localStorage.removeItem('keycloak_refresh_token');
      // Optional: Confirm logout by reloading the page
      window.location.href = 'http://invoicehub.space/login';
    }).catch(err => {
      console.error('Logout failed:', err);
    });
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.showAlways || (item.adminOnly && isAdmin)
  );

  return (
    <div className="fixed top-0 left-0 w-[23.75rem] h-screen bg-slate-50 dark:bg-stone-950 flex flex-col border-r dark:border-stone-100 border-stone-900 z-50">
      <PanelRightOpen
        className="ml-auto cursor-pointer text-stone-950 dark:text-stone-50 mt-[20px] mr-[20px]"
        onClick={onClose}
      />
      <div className="flex flex-col items-start gap-[20px] p-6">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl text-stone-950 dark:text-stone-50">
          Overview
        </h1>
        <ul className="w-full">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.name}
                className="leading-7 [&:not(:first-child)]:mt-2 text-lg flex items-center gap-[10px] px-3 py-2 rounded-md transition-all cursor-pointer text-stone-950 dark:text-stone-50 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-accent"
                onClick={(event) => handleItemClick(item.path, event)}
              >
                <Icon className="text-xl" />
                <span className="font-medium">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;