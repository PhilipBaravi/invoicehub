import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Separator } from "@radix-ui/react-dropdown-menu";

import CurrencyExchangeRates from "./CurrencyExchangeRates";
// import TransactionsCard from "./TransactionsCard";
import ProductSalesChart from "./charts/ProductSalesChart";
import RecentSales from "./RecentSales";
// import FinancialSummaryChart from "./charts/FinancialSummary";
// import QuantitiesSummaryChart from "./charts/QuantitiesSummaryChart";
import TopSoldProducts from "./TopSoldProducts";
import TotalProfitLoss from "./charts/TotalProfitLoss";
import StatisticsGrid from "./StatisticsGrid";

const DashboardDefault: FC = () => {
  const { t } = useTranslation("dashboardDefault");

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 px-6">
        {t("dashboard.greetings")} 👋
      </h1>
      <Separator className="w-full h-[1px] bg-stone-300 dark:bg-stone-700 mt-2" />
      <main className="w-[95%] flex flex-col gap-4 pt-4 mx-auto">
        <CurrencyExchangeRates />

        <div className="w-full flex flex-col xl:flex-row justify-between items-center gap-2">
          <div className="w-full xl:w-[72%]">
            <ProductSalesChart />
          </div>
          <div className="w-full xl:w-[27%]">
            <TotalProfitLoss />
          </div>
        </div>
        <div className="w-full">
          <StatisticsGrid />
        </div>
        <div className="w-full flex flex-col xl:flex-row justify-between items-start gap-2">
          <div className="w-full flex flex-col xl:flex-row justify-between items-center gap-2">
            <div className="w-full xl:w-[49%]">
              <TopSoldProducts />
            </div>

            <div className="w-full xl:w-[49%]">
              <RecentSales />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardDefault;
