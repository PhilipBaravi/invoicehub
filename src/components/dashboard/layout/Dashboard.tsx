import { FC, useState } from "react";
import Header from "./header/Header";
import { Outlet } from "react-router-dom";
import LargeScreenSidebar from "./sidebar/LargeScreenSidebar";
import { useMediaQuery } from 'react-responsive';
import GlobalContextMenu from "../GlobalContextMenu";
import AIChatbot from "../dashboarddefault/AIChatBot";

const Dashboard: FC = () => {
  const [isLargeSidebarOpen, setIsLargeSidebarOpen] = useState(false);

  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  const sidebarWidth = isLargeSidebarOpen ? '250px' : '80px';

  const toggleLargeSidebar = () => {
    setIsLargeSidebarOpen(!isLargeSidebarOpen); 
  };

  return (
    <GlobalContextMenu>
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
            width: `calc(100% - ${isLargeScreen ? sidebarWidth : '0px'})`, 
            marginLeft: isLargeScreen ? sidebarWidth : '0px',
          }}
        >
          <Header toggleLargeSidebar={toggleLargeSidebar} />

          {/* Main layout where the nested routes will render */}
          <div id="main-layout" className="flex-1 h-full p-4 overflow-auto relative">
            {/* Use <Outlet /> to render the nested routes here */}
            <Outlet />

          </div>
        </div>
      </div>
      <AIChatbot />
    </GlobalContextMenu>
  );
};

export default Dashboard;
