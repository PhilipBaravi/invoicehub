import { FC, useEffect, useRef } from "react";
import {  useNavigate } from "react-router-dom";
import { LayoutDashboard, UserSearch, FolderKanban, UserPen, LogIn, Building2, FileText } from 'lucide-react';
import { motion } from "framer-motion";

interface LargeScreenSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Employee', icon: UserSearch, path: '/dashboard/employee' },
  {name: 'Clients', icon: Building2, path:'/dashboard/clients'},
  {name: 'Invoice', icon: FileText, path:'/dashboard/invoice'},
  { name: 'Categories', icon: FolderKanban, path: '/dashboard/categories' },
  { name: 'Profile', icon: UserPen, path: '/dashboard/profile' },
  { name: 'Login', icon: LogIn, path: '/new-login' },
];

const LargeScreenSidebar: FC<LargeScreenSidebarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    if (path === '/new-login') {
      navigate(path);
      onClose(); // Close only for login
    } else {
      navigate(path); // Navigate within the dashboard without closing the sidebar
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <motion.div
      ref={sidebarRef}
      initial={{ width: '80px' }}
      animate={{ width: isOpen ? '250px' : '80px' }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 h-screen bg-slate-50 dark:bg-stone-950 flex flex-col border-r border-stone-700 dark:border-stone-400 z-50"
    >
      <div
        className="absolute top-[20px] -right-[15px] h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all border bg-stone-950 dark:bg-stone-50 hover:bg-stone-900 dark:hover:bg-stone-100 border-stone-50 dark:border-stone-950"
        onClick={onClose}
      >
        {isOpen ? (
          <span className="text-stone-50 dark:text-stone-950 text-lg">{'←'}</span>
        ) : (
          <span className="text-stone-50 dark:text-stone-950 text-lg">{'→'}</span>
        )}
      </div>

      <ul className="flex flex-col items-start gap-[20px] p-4 mt-[60px]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.name}
              className="flex items-center gap-[10px] px-2 py-2 rounded-md hover:bg-stone-300 dark:hover:bg-stone-400 text-stone-950 dark:text-stone-50 transition-all cursor-pointer"
              onClick={() => handleItemClick(item.path)}
            >
              <Icon className="text-xl" />
              {isOpen && <span className="ml-2 font-medium">{item.name}</span>}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};

export default LargeScreenSidebar;
