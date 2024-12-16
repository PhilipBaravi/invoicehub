import { FC, useEffect, useState } from "react";
import { ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useKeycloak } from "@react-keycloak/web";
import StatCard from "./StatCard";

interface SummaryResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_products_sold: number;
    total_employees: number;
    total_products: number;
    total_clients: number;
  };
}

const StatisticsGrid: FC = () => {
  const { t } = useTranslation('dashboardDefault');
  const { keycloak } = useKeycloak();

  const [summary, setSummary] = useState<{
    total_products_sold: number;
    total_employees: number;
    total_products: number;
    total_clients: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!keycloak.token) return;

      setLoading(true);
      try {
        const response = await fetch("https://api.invoicehub.space/api/v1/dashboard/summaryQuantities", {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });

        const result: SummaryResponse = await response.json();
        if (result.success) {
          setSummary(result.data);
        } else {
          console.error("Failed to fetch summary:", result.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [keycloak.token]);

  if (loading || !summary) {
    return <div className="text-center w-full">Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 auto-rows-min w-full">
      <StatCard
        title={t('statisticsGrid.title')}
        value={summary.total_products_sold.toString()}
        description={t('statisticsGrid.titleDescription')}
        icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />} 
        // trend={""}      
         />
      <StatCard
        title={t('statisticsGrid.employees')}
        value={summary.total_employees.toString()}
        description={t('statisticsGrid.titleDescription')}
        icon={<Users className="h-4 w-4 text-muted-foreground" />} trend={""}      />
      <StatCard
        title={t('statisticsGrid.clients')}
        value={summary.total_clients.toString()}
        description={t('statisticsGrid.employeesDescription')}
        icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        // trend={""}      
        />
      <StatCard
        title={t('statisticsGrid.salesTitle')}
        value={summary.total_products.toString()}
        description={t('statisticsGrid.salesDescription')}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} trend={""}      />
    </div>
  );
};

export default StatisticsGrid;
