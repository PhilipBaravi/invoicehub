import { FC, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useKeycloak } from "@react-keycloak/web";
import { useTranslation } from "react-i18next";

type FinancialSummary = {
  name: string;
  value: number;
};

const COLORS = ['#0088FE', '#00C49F', '#5b21b6'];

const FinancialSummaryChart: FC = () => {
  const { keycloak } = useKeycloak();
  const [data, setData] = useState<FinancialSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("dashboardDefault"); // Use the correct namespace

  const fetchFinancialSummary = async () => {
    try {
      const response = await fetch('https://api.invoicehub.space/dashboard/summaryNumbers', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      const result = await response.json();

      if (result.success && result.data) {
        const transformedData = [
          { name: t("financialSummary.chart.totalCost"), value: result.data.total_cost },
          { name: t("financialSummary.chart.profitLoss"), value: result.data.total_profit_loss },
          { name: t("financialSummary.chart.totalSales"), value: result.data.total_sales },
        ];
        setData(transformedData);
      } else {
        console.error("Failed to fetch financial summary data:", result.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching financial summary data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keycloak && keycloak.token) {
      fetchFinancialSummary();
    }
  }, [keycloak.token]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("financialSummary.title")}</CardTitle>
          <CardDescription>{t("financialSummary.description")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {loading ? (
          <div className="text-lg font-semibold">{t("financialSummary.loading")}</div>
        ) : (
          <ChartContainer
            config={{
              totalCost: {
                label: t("financialSummary.chart.totalCost"),
                color: COLORS[0],
              },
              profitLoss: {
                label: t("financialSummary.chart.profitLoss"),
                color: COLORS[1],
              },
              totalSales: {
                label: t("financialSummary.chart.totalSales"),
                color: COLORS[2],
              },
            }}
            className="h-[300px]"
          >
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {t("financialSummary.chart.tooltip.name")}: {data.name}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              ${data.value.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {t("financialSummary.chart.tooltip.percentage")}
                            </span>
                            <span className="font-bold">
                              {((data.value / total) * 100).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryChart;
