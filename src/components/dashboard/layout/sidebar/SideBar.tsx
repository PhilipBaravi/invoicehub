import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PanelRightOpen,
  LayoutDashboard,
  UserSearch,
  FolderKanban,
  LogIn,
  Building2,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/hooks/useAuth";
import { logOut } from "@/lib/utils/logout";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: FC<SideBarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboardDefault");
  const { isAdmin } = useAuth();

  const menuItems = [
    {
      name: t("sidebar.dashboard"),
      icon: LayoutDashboard,
      path: "/dashboard",
      showAlways: true,
    },
    {
      name: t("sidebar.invoice"),
      icon: FileText,
      path: "/dashboard/invoices",
      showAlways: true,
    },
    {
      name: t("sidebar.employee"),
      icon: UserSearch,
      path: "/dashboard/employee",
      adminOnly: true,
    },
    {
      name: t("sidebar.clients"),
      icon: Building2,
      path: "/dashboard/clients",
      showAlways: true,
    },
    {
      name: t("sidebar.categories"),
      icon: FolderKanban,
      path: "/dashboard/categories",
      showAlways: true,
    },
    { name: t("sidebar.login"), icon: LogIn, path: "/login", showAlways: true },
  ];

  const handleItemClick = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (path === "/login") {
      logOut();
    } else {
      navigate(path);
      onClose();
    }
  };

  const filteredMenuItems = menuItems.filter(
    (item) => item.showAlways || (item.adminOnly && isAdmin)
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <motion.div
        initial={{ x: isOpen ? "-100%" : "0" }}
        animate={{ x: isOpen ? "0" : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-[20rem] h-screen bg-slate-50 dark:bg-stone-950 flex flex-col border-r dark:border-stone-100 border-stone-900 z-50"
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the sidebar from closing it
      >
        <PanelRightOpen
          className="ml-auto cursor-pointer text-stone-950 dark:text-stone-50 mt-[20px] mr-[20px]"
          onClick={onClose}
        />
        <div className="flex flex-col items-start gap-[20px] p-6 overflow-y-auto overflow-x-hidden scroll-smooth">
          <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-5xl text-stone-950 dark:text-stone-50">
            Overview
          </h1>
          <ul className="w-full">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.name}
                  className="leading-7 [&:not(:first-child)]:mt-2 text-md flex items-center gap-[10px] px-3 py-2 rounded-md transition-all cursor-pointer text-stone-950 dark:text-stone-50"
                  onClick={(event) => handleItemClick(item.path, event)}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </>
  );
};

export default SideBar;
