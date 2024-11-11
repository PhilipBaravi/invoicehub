import { ShoppingBag, Users, TrendingUp } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";

const StatisticsGrid: FC = () => {
    const { t } = useTranslation('dashboardDefault');
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 auto-rows-min w-full">
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

  export default StatisticsGrid