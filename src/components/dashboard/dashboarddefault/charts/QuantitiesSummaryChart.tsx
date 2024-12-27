import { FC, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useKeycloak } from "@react-keycloak/web";
import { QuantitiesSummary } from "./types";
import { API_BASE_URL } from "@/lib/utils/constants";

const QuantitiesSummaryChart: FC = () => {
  const { keycloak } = useKeycloak();
  const [data, setData] = useState<QuantitiesSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuantitiesSummary = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}dashboard/summaryQuantities`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const transformedData: QuantitiesSummary[] = [
          { name: "Total Employees", value: result.data.total_employees },
          {
            name: "Total Products Sold",
            value: result.data.total_products_sold,
          },
          { name: "Total Clients", value: result.data.total_clients },
          { name: "Total Products", value: result.data.total_products },
        ];
        setData(transformedData);
      } else {
        throw new Error(
          result.message || "Failed to fetch quantities summary data"
        );
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching quantities summary data:",
        error
      );
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keycloak && keycloak.token) {
      fetchQuantitiesSummary();
    }
  }, [keycloak.token]);

  const getChartColor = (name: string) => {
    switch (name) {
      case "Total Employees":
        return "hsl(45, 84%, 50%)";
      case "Total Products Sold":
        return "hsl(180, 84%, 50%)";
      case "Total Clients":
        return "hsl(300, 84%, 50%)";
      case "Total Products":
        return "hsl(75, 84%, 50%)";
      default:
        return "hsl(0, 0%, 60%)";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quantities Overview</CardTitle>
        <CardDescription>
          Summary of employees, products, clients, and sales
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="text-lg font-semibold">
              Loading quantities data...
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="text-lg font-semibold text-red-500">
              Error: {error}
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }} // Disable hover background
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as QuantitiesSummary;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div>
                            <span className="text-[0.75rem] font-medium">
                              {data.name}: {data.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Amount"
                  barSize={90}
                  isAnimationActive={false}
                >
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

export default QuantitiesSummaryChart;
