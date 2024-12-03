import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, UserSearch, FolderKanban, LogIn, Building2, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useKeycloak } from "@react-keycloak/web";
import { useAuth } from "@/useAuth";

interface LargeScreenSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const LargeScreenSidebar: FC<LargeScreenSidebarProps> = ({ isOpen, onClose }) => {
  const { keycloak } = useKeycloak();
  const { isAdmin } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(isOpen ? "250px" : "80px");
  const { t } = useTranslation("dashboardDefault");

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setSidebarWidth(isOpen ? "250px" : "80px");
  }, [isOpen]);

  const filteredMenuItems = menuItems.filter(item => 
    item.showAlways || (item.adminOnly && isAdmin)
  );

  return (
    <div
      ref={sidebarRef}
      style={{
        width: sidebarWidth,
        transition: "width 0.6s ease",
      }}
      className="fixed top-0 left-0 h-screen bg-slate-50 dark:bg-stone-950 flex flex-col border-r border-stone-200 dark:border-stone-700 z-50"
    >
      <div
        className="absolute top-[20px] -right-[15px] h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all border bg-stone-950 dark:bg-stone-50 hover:bg-stone-900 dark:hover:bg-stone-100 border-stone-50 dark:border-stone-950"
        onClick={onClose}
      >
        {isOpen ? (
          <span className="text-stone-50 dark:text-stone-950 text-lg">{"←"}</span>
        ) : (
          <span className="text-stone-50 dark:text-stone-950 text-lg">{"→"}</span>
        )}
      </div>

      <ul className="flex flex-col items-start gap-[20px] p-4 mt-[60px]">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;

          const handleClick = () => {
            if (item.path === "/login") {
              logOut();
            } else {
              navigate(item.path);
            }
          };

          return (
            <li
              key={item.name}
              className="flex items-center gap-[10px] px-2 py-2 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-950 dark:text-stone-50 transition-all cursor-pointer"
              onClick={handleClick}
            >
              <Icon className="text-xl" />
              {isOpen && <span className="ml-2 font-medium">{item.name}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LargeScreenSidebar;