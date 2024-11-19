import { FC } from "react";
import LanguageSelector from "@/components/main-authentication/new-login-page/LanguageSelector";
import { ModeToggle } from "@/components/dashboard/layout/ModeToggle";
import GetStartedBtn from "./GetStartedBtn";

const LandingNavigation: FC = () => {
  return (
    <div className="w-full h-[100px] flex justify-center items-center">
      <div className="w-[85%] flex justify-between items-center">
        <div>
          <h1 className="font-poppins font-semibold text-[1.5rem] lg:text-[2rem] leading-[60px]">
            InvoiceHub
          </h1>
        </div>
        <div className="flex gap-[15px] items-center">
          <LanguageSelector />
          <ModeToggle />
          <GetStartedBtn isVisible={false} />
        </div>
      </div>
    </div>
  );
};

export default LandingNavigation;
