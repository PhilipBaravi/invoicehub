import { FC, useEffect, useRef } from "react";
import { LayoutDashboard, UserSearch, FolderKanban, UserPen, LogIn } from 'lucide-react';
import { motion } from "framer-motion";

interface LargeScreenSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Employee', icon: UserSearch },
  { name: 'Product', icon: FolderKanban },
  { name: 'Profile', icon: UserPen },
  { name: 'Login', icon: LogIn },
];

const LargeScreenSidebar: FC<LargeScreenSidebarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Detect clicks outside the sidebar
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
      animate={{ width: isOpen ? '250px' : '80px' }} // Sidebar width when opened/closed
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 h-screen bg-stone-950 dark:bg-stone-50 flex flex-col border-r border-stone-700 dark:border-stone-400 z-50"
    >
      {/* Arrow button for opening/closing sidebar */}
      <div
        className="absolute top-[20px] -right-[15px] h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all border bg-stone-50 dark:bg-stone-950 hover:bg-stone-100 dark:hover:bg-stone-900 border-stone-950 dark:border-stone-50"
        onClick={onClose} // Correctly tied to onClose event
      >
        {isOpen ? (
          <span className="text-stone-950 dark:text-stone-50 text-lg">{'←'}</span>
        ) : (
          <span className="text-stone-950 dark:text-stone-50 text-lg">{'→'}</span>
        )}
      </div>

      <ul className="flex flex-col items-start gap-[20px] p-4 mt-[60px]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.name}
              className="flex items-center gap-[10px] px-2 py-2 rounded-md hover:bg-stone-600 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-950 transition-all cursor-pointer"
            >
              <Icon className="text-stone-50 dark:text-stone-950" />
              {isOpen && <span className="ml-2">{item.name}</span>}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};

export default LargeScreenSidebar;
