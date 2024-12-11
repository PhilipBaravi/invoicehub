import { FC, useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useKeycloak } from "@react-keycloak/web";

type FinancialSummary = {
  name: string;
  value: number;
};

const FinancialSummaryChart: FC = () => {
  const { keycloak } = useKeycloak();
  const [data, setData] = useState<FinancialSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialSummary = async () => {
    try {
      const response = await fetch('https://api.invoicehub.space/api/v1/dashboard/summaryNumbers', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const transformedData: FinancialSummary[] = [
          { name: "Total Cost", value: result.data.total_cost },
          { name: "Total Profit/Loss", value: result.data.total_profit_loss },
          { name: "Total Sales", value: result.data.total_sales },
        ];
        setData(transformedData);
      } else {
        throw new Error(result.message || "Failed to fetch financial summary data");
      }
    } catch (error) {
      console.error("An error occurred while fetching financial summary data:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keycloak && keycloak.token) {
      fetchFinancialSummary();
    }
  }, [keycloak.token]);

  const getChartColor = (name: string) => {
    switch (name) {
      case "Total Cost":
        return "hsl(0, 84%, 60%)";
      case "Total Profit/Loss":
        return "hsl(120, 84%, 40%)";
      case "Total Sales":
        return "hsl(210, 84%, 60%)";
      default:
        return "hsl(0, 0%, 60%)";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Summary of costs, profits/losses, and sales</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="text-lg font-semibold">Loading financial data...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="text-lg font-semibold text-red-500">Error: {error}</div>
          </div>
        ) : (
          <div className="w-full h-full">
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value.toLocaleString()}`} />
    <Tooltip
      cursor={{ fill: "transparent" }} // Disable hover background
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          const data = payload[0].payload as FinancialSummary;
          return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
              <div>
                <span className="text-[0.75rem] font-medium">
                  {data.name}: ${data.value.toLocaleString()}
                </span>
              </div>
            </div>
          );
        }
        return null;
      }}
    />
    <Bar dataKey="value" name="Amount" barSize={90} isAnimationActive={false}>
      {data.map((entry) => (
        <Cell
          key={`cell-${entry.name}`}
          fill={getChartColor(entry.name)}
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>


          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryChart;
