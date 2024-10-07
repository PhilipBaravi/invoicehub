import { FC, useState } from "react";
import { Menu } from "lucide-react";
import SideBar from "../sidebar/SideBar";
import { ModeToggle } from "../ModeToggle";
import HeaderSearch from "./HeaderSearch";
import HeaderAvatar from "./HeaderAvatar";
import { AnimatePresence } from "framer-motion";

const Header: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full h-[3.3rem] flex justify-between items-center">
      <div className="pl-[20px]">
        <Menu
          className="cursor-pointer light:text-stone-950 dark:text-stone-50"
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex items-center gap-[20px] pr-[20px]">
        <HeaderSearch />
        <ModeToggle />
        <HeaderAvatar />
      </div>

      {/* Wrap SideBar in AnimatePresence */}
      <AnimatePresence>
        {isSidebarOpen && (
          <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
