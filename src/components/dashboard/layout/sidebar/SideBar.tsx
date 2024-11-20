import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { PanelRightOpen, LayoutDashboard, UserSearch, FolderKanban, LogIn, Building2, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: FC<SideBarProps> = ({ onClose }) => {
  const navigate = useNavigate(); // Create navigate instance for redirection
  const { t } = useTranslation("dashboardDefault");

  const menuItems = [
    { name: t("sidebar.dashboard"), icon: LayoutDashboard, path: "/dashboard" },
    { name: t("sidebar.invoice"), icon: FileText, path: "/dashboard/invoices" },
    { name: t("sidebar.employee"), icon: UserSearch, path: "/dashboard/employee" },
    { name: t("sidebar.clients"), icon: Building2, path: "/dashboard/clients" },
    { name: t("sidebar.categories"), icon: FolderKanban, path: "/dashboard/categories" },
    { name: t("sidebar.login"), icon: LogIn, path: "/login" },
  ];

  const handleItemClick = (path: string, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link behavior
    if (path === "/login") {
      // If login is clicked, perform login-specific action
      handleLogin();
      onClose();
    } else {
      navigate(path); // Navigate to other paths
    }
  };

  const handleLogin = () => {
    navigate("/login"); // Redirect to the login page
    // Add any additional login-specific logic here if needed
  };

  return (
    <div
      className="fixed top-0 left-0 w-[23.75rem] h-screen bg-slate-50 dark:bg-stone-950 flex flex-col border-r dark:border-stone-100 border-stone-900 z-50"
    >
      <PanelRightOpen
        className="ml-auto cursor-pointer text-stone-950 dark:text-stone-50 mt-[20px] mr-[20px]"
        onClick={onClose}
      />
      <div className="flex flex-col items-start gap-[20px] p-6">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl text-stone-950 dark:text-stone-50">
          Overview
        </h1>
        <ul className="w-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.name}
                className="leading-7 [&:not(:first-child)]:mt-2 text-lg flex items-center gap-[10px] px-3 py-2 rounded-md transition-all cursor-pointer text-stone-950 dark:text-stone-50 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-accent"
                onClick={(event) => handleItemClick(item.path, event)} // Pass event to handler
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
