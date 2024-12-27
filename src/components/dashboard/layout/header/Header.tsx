import { FC, useState } from "react";
import { Menu } from "lucide-react";
import SideBar from "../sidebar/SideBar";
import { ModeToggle } from "../ModeToggle";
import HeaderAvatar from "./HeaderAvatar";
import { useMediaQuery } from "react-responsive";
import LanguageSelector from "@/components/main-authentication/new-login-page/LanguageSelector";
import HeaderBreadcrumbs from "./HeaderBreadcrumbs";

type HeaderProps = {
  toggleLargeSidebar: () => void;
};

const Header: FC<HeaderProps> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

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
      <div className="flex-grow flex items-center pl-[20px] pt-[20px] lg:block">
        <HeaderBreadcrumbs />
      </div>
      <div className="flex items-center gap-[20px] pr-[20px]">
        <LanguageSelector />
        <ModeToggle />
        <HeaderAvatar />
      </div>

      {/* Sidebar for small screens */}
      {!isLargeScreen && isSidebarOpen && (
        <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      )}
    </div>
  );
};

export default Header;
