import { FC } from "react";
import { ThemeProvider } from "../ThemeProvider";
import Header from "./header/Header";
import DashboardDefault from "./dashboarddefault/DashboardDefault";
import DashboardCharts from "./dashboarddefault/DashboardCharts";

const Dashboard: FC = () => {
    return(
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="w-full h-screen bg-stone-50 dark:bg-stone-950">
            <Header />
            <div className="w-full h-screen">
            <DashboardDefault />
            <DashboardCharts />
            </div>
            
        </div>
        </ThemeProvider>
    )
}

export default Dashboard