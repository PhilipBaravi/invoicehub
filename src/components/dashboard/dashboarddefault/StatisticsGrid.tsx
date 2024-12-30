import { FC, useEffect, useState } from "react";
import { ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useKeycloak } from "@react-keycloak/web";
import StatCard from "./StatCard";
import { SummaryResponse } from "./charts/types";
import { API_BASE_URL } from "@/lib/utils/constants";
import { useNavigate } from "react-router-dom";

const StatisticsGrid: FC = () => {
  const { t } = useTranslation("dashboardDefault");
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

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
        const response = await fetch(
          `${API_BASE_URL}dashboard/summaryQuantities`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );

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

  const StatCardData = [
    {
      id: 1,
      title: t("statisticsGrid.title"),
      value: summary.total_products_sold.toString(),
      description: t("statisticsGrid.titleDescription"),
      icon: <ShoppingBag className="h-4 w-4 text-muted-foreground" />,
      trend: "",
      link: "/dashboard/categories",
    },
    {
      id: 2,
      title: t("statisticsGrid.employees"),
      value: summary.total_employees.toString(),
      description: t("statisticsGrid.employeesDescription"),
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: "",
      link: "/dashboard/employee",
    },
    {
      id: 3,
      title: t("statisticsGrid.clients"),
      value: summary.total_clients.toString(),
      description: t("statisticsGrid.employeesDescription"),
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: "",
      link: "/dashboard/clients",
    },
    {
      id: 4,
      title: t("statisticsGrid.salesTitle"),
      value: summary.total_products.toString(),
      description: t("statisticsGrid.salesDescription"),
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      trend: "",
      link: "/dashboard/categories",
    },
  ];

  const statCardRedirectHandle = (link: string) => {
    navigate(link);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 auto-rows-min w-full">
      {StatCardData.map((card) => {
        return (
          <StatCard
            key={card.id}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            trend={card.trend}
            onClick={() => statCardRedirectHandle(card.link)}
          />
        );
      })}
    </div>
  );
};

export default StatisticsGrid;
