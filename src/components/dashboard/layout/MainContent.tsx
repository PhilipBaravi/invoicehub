import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import LargeScreenSidebar from "./sidebar/LargeScreenSidebar";

interface MainContentProps {
  isLargeScreen: boolean;
  isLargeSidebarOpen: boolean;
  toggleLargeSidebar: () => void;
}

const MainContent: FC<MainContentProps> = ({
  isLargeScreen,
  isLargeSidebarOpen,
  toggleLargeSidebar,
}) => {
  const sidebarWidth = isLargeSidebarOpen ? "250px" : "80px";

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-stone-950 indigo:bg-stone-900 sky:bg-sky-700 teal:bg-teal-700 orange:bg-orange-700 flex">
      {isLargeScreen && (
        <LargeScreenSidebar
          isOpen={isLargeSidebarOpen}
          onClose={toggleLargeSidebar}
        />
      )}

      <div
        className="flex flex-col h-screen transition-all duration-700 ease-in-out"
        style={{
          width: `calc(100% - ${isLargeScreen ? sidebarWidth : "0px"})`,
          marginLeft: isLargeScreen ? sidebarWidth : "0px",
        }}
      >
        <Header toggleLargeSidebar={toggleLargeSidebar} />

        <div
          id="main-layout"
          className="flex-1 h-full p-4 overflow-auto relative"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainContent;