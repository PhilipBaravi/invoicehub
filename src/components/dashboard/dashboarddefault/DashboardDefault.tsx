import { FC, useState } from "react";
import { Link } from "react-router-dom";
import CurrencyExchangeRates from "./CurrencyExchangeRates";
import ProductSalesChart from "./ProductSalesChart";
import { Component } from "./testChart";
import { ArrowUpRight, TrendingUp, Users, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DashboardDefault: FC = () => {
  const { t } = useTranslation('dashboardDefault');
  const [components] = useState([
    { id: "stats", title: "Statistics", component: <StatisticsGrid />, width: "col-span-8" },
    { id: "currency", title: "Currency Exchange Rates", component: <CurrencyExchangeRates />, width: "col-span-8" },
    { id: 'testCharts', title: 'Test Charts', component: <Component />, width: "col-span-4" },
    { id: "productSales", title: "Product Sales Chart", component: <ProductSalesChart />, width: "col-span-8" },
    { id: "transactions", title: "Transactions", component: <TransactionsCard />, width: "col-span-4" },
  ]);

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 px-6">
        {t('dashboard.greetings')} 👋
      </h1>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 w-full px-6">
        <div className="grid grid-cols-12 gap-4 auto-rows-min">
          {/* Left Side (2/3 width) */}
          <div className="col-span-8 grid grid-rows-2 gap-4">
            <div className="row-span-1">{components[0].component}</div>
            <div className="row-span-1">{components[1].component}</div>
          </div>

          {/* Right Side (1/3 width) */}
          <div className="col-span-4 grid-rows-2 gap-4">
            <div className="row-span-2">{components[2].component}</div>
          </div>

          {/* Bottom Row */}
          <div className="col-span-4">{components[4].component}</div>
          <div className="col-span-8">{components[3].component}</div>
        </div>
      </main>
    </>
  );
};

const StatisticsGrid: FC = () => {
  const { t } = useTranslation('dashboardDefault')
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 auto-rows-min">
      <StatCard
        title={t('statisticsGrid.title')}
        value="5,234"
        description={t('statisticsGrid.titleDescription')}
        icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
        trend="+12.5%"
      />
      <StatCard
        title={t('statisticsGrid.employees')}
        value="12"
        description={t('statisticsGrid.titleDescription')}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend="+2.5%"
      />
      <StatCard
        title={t('statisticsGrid.clients')}
        value="3,456"
        description={t('statisticsGrid.employeesDescription')}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend="+5.2%"
      />
      <StatCard
        title={t('statisticsGrid.salesTitle')}
        value="$89,456"
        description={t('statisticsGrid.salesDescription')}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        trend="+18.7%"
      />
    </div>
  );
};

const TransactionsCard: FC = () => {
  const { t } = useTranslation('dashboardDefault');
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{t('transactionsCard.title')}</CardTitle>
          <CardDescription>{t('transactionsCard.titleDescription')}</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link to="/transactions">
            {t('transactionsCard.viewAll')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('transactionsCard.customer')}</TableHead>
              <TableHead className="hidden xl:table-column">{t('transactionsCard.customerType')}</TableHead>
              <TableHead className="hidden xl:table-column">{t('transactionsCard.customerType')}</TableHead>
              <TableHead className="hidden xl:table-column">{t('transactionsCard.customerStatus')}</TableHead>
              <TableHead className="text-right">{t('transactionsCard.customerAmount')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  liam@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Sale</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2023-06-23
              </TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, description, icon, trend }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-2 flex items-center text-sm text-green-600">
          <TrendingUp className="mr-1 h-4 w-4" />
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardDefault;