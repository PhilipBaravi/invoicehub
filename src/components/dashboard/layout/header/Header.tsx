import { FC, useState } from "react";
import { Menu } from "lucide-react";
import SideBar from "../sidebar/SideBar";
import { ModeToggle } from "../ModeToggle";
import HeaderSearch from "./HeaderSearch";
import { AnimatePresence } from "framer-motion";
import HeaderAvatar from "./HeaderAvatar";
import { useMediaQuery } from 'react-responsive';

type HeaderProps = {
  toggleLargeSidebar: () => void;
};

const Header: FC<HeaderProps> = ({ toggleLargeSidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Detect if the screen width is larger than 1024px
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full h-[3.3rem] flex justify-between items-center">
      <div className="pl-[20px]">
        {/* Render the Menu button only on small screens */}
        {!isLargeScreen && (
          <Menu
            className="cursor-pointer light:text-stone-950 dark:text-stone-50"
            onClick={toggleSidebar}
          />
        )}
      </div>
      <div className="flex items-center gap-[20px] pr-[20px]">
        <HeaderSearch />
        <ModeToggle />
        <HeaderAvatar />
      </div>

      {/* Sidebar for small screens */}
      {!isLargeScreen && (
        <AnimatePresence>
          {isSidebarOpen && (
            <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Header;
