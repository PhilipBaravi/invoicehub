import { FC } from "react";
import GetStartedBtn from "./GetStartedBtn";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const LandingAbout: FC = () => {
  const { t } = useTranslation('landingPage')
  return (
    <div className="w-[90%] pt-4 flex flex-col justify-center items-center md:flex-row gap-8">
      <div className="flex flex-col justify-center items-center gap-4 w-full lg:w-[45%]">
        <h1 className="font-poppins text-[1.8rem] leading-large font-bold text-center tracking-tight">{t('main.title')}</h1>
        <p className="font-poppins text-[1rem] leading-[32px] font-light text-center">{t('main.subtitle')}</p>
        <div className="pt-2">
        <GetStartedBtn isVisible={true} />
            </div>
      </div>
      <div className="w-full lg:w-[55%] flex flex-col pt-6">
        <Card>
        <div className="flex justify-between items-center">   
            <div className="w-full">
            <img src="/images/dashboardDark.png" alt="Dashboard UI" className="w-full rounded-2xl shadow-2xl" /> 
            </div>
        </div>
        </Card>
      </div>
    </div>
  );
};


export default LandingAbout;