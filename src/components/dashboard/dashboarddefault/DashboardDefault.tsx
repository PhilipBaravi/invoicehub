import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Separator } from "@radix-ui/react-dropdown-menu";
import CurrencyExchangeRates from "./CurrencyExchangeRates";
import StatisticsGrid from "./StatisticsGrid";
import TransactionsCard from "./TransactionsCard";
import ProductSalesChart from "./ProductSalesChart";
import FinancialSummaryChart from "./FinancialSummary";

const DashboardDefault: FC = () => {
  const { t } = useTranslation('dashboardDefault');

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 px-6">
        {t('dashboard.greetings')} 👋
      </h1>
      <Separator className="w-full h-[1px] bg-stone-300 dark:bg-stone-100 mt-2"/>
      <main className="w-[95%] flex flex-col gap-4 pt-4 mx-auto">
      <CurrencyExchangeRates />
  <div className="w-full flex flex-col xl:flex-row gap-4 justify-between items-center">
    <div className="flex flex-col gap-4 w-full xl:w-[70%]">
    <ProductSalesChart />
    
      
    </div>
    <div className="w-full w-full xl:w-[30%]">
      <FinancialSummaryChart />
    </div>
  </div>
  <StatisticsGrid />
  <TransactionsCard />
</main>

    </>
  );
};

export default DashboardDefault;
