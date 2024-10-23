import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { PanelRightOpen, LayoutDashboard, UserSearch, FolderKanban, UserPen, LogIn, Building2, FileText } from 'lucide-react';

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Employee', icon: UserSearch, path: '/dashboard/employee' },
  { name: 'Clients', icon: Building2, path: '/dashboard/clients' },
  { name: 'Invoice', icon: FileText, path: '/dashboard/invoice' },
  { name: 'Categories', icon: FolderKanban, path: '/dashboard/categories' },
  { name: 'Profile', icon: UserPen, path: '/dashboard/profile' },
  { name: 'Login', icon: LogIn, path: '/new-login' }, 
];

const SideBar: FC<SideBarProps> = ({ onClose }) => {
  const navigate = useNavigate(); // Create navigate instance for redirection

  const handleItemClick = (path: string, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link behavior
    if (path === '/new-login') {
      // If login is clicked, navigate outside the dashboard
      navigate(path);
      onClose();
    } else {
      navigate(path);
    }
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
                onClick={(event) => handleItemClick(item.path, event)}  // Pass event to handler
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
