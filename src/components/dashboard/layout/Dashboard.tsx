import { FC, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import Header from "./header/Header";
import DashboardDefault from "../dashboarddefault/DashboardDefault";
import LargeScreenSidebar from "./sidebar/LargeScreenSidebar";
import { useMediaQuery } from 'react-responsive';

const Dashboard: FC = () => {
  const [isLargeSidebarOpen, setIsLargeSidebarOpen] = useState(false);

  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  const sidebarWidth = isLargeSidebarOpen ? '250px' : '80px';

  const toggleLargeSidebar = () => {
    setIsLargeSidebarOpen(!isLargeSidebarOpen); 
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="w-full h-screen bg-stone-50 dark:bg-stone-950 flex">
        
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
            marginLeft: isLargeScreen ? sidebarWidth : '0px', // For proper alignment
          }}
        >
          {/* Pass toggleLargeSidebar to Header */}
          <Header toggleLargeSidebar={toggleLargeSidebar} />

          {/* Main layout */}
          <div id="main-layout" className="flex-1 h-full p-4 overflow-auto">
            <DashboardDefault />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
