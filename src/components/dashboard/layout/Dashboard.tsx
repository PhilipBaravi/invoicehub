import { FC, useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import GlobalContextMenu from "../GlobalContextMenu";
import MainContent from "./MainContent";
import RotationMessage from "./RotationMessage";
import ResizableChatLayout from "../dashboarddefault/ResizableChatLayout";

const Dashboard: FC = () => {
  const [isLargeSidebarOpen, setIsLargeSidebarOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  const toggleLargeSidebar = useCallback(() => {
    setIsLargeSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return (
    <>
      <ResizableChatLayout>
        {isSmallScreen && isPortrait ? (
          <RotationMessage />
        ) : (
          isLargeScreen ? (
            <GlobalContextMenu>
              <MainContent
                isLargeScreen={isLargeScreen}
                isLargeSidebarOpen={isLargeSidebarOpen}
                toggleLargeSidebar={toggleLargeSidebar}
              />
            </GlobalContextMenu>
          ) : (
            <MainContent
              isLargeScreen={isLargeScreen}
              isLargeSidebarOpen={isLargeSidebarOpen}
              toggleLargeSidebar={toggleLargeSidebar}
            />
          )
        )}
      </ResizableChatLayout>
    </>
  );
};

export default Dashboard;