import { FC } from "react";
import LandingNavigation from "./LandingNavigation";
import LandingAbout from "./LandingAbout";
import DataVisualizationShowcase from "./AboutData";
import AboutInvoices from "./AboutInvoices";
import AboutAi from "./AboutAi";

const LangindPage : FC = () => {
    return (
        <div className="w-full h-auto light:bg-stone-100 dark:bg-stone-950 flex justify-center items-center flex-col">
            <LandingNavigation />
            <LandingAbout />
            <div className="bg-gradient-to-b from-background to-muted w-full">
            <AboutAi />
            <DataVisualizationShowcase />
            <AboutInvoices />
            </div>
        </div>
    )
}

export default LangindPage