import { FC, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chartData } from "./chart-data";

const AboutDataFirstChart: FC = () => {
  const { t } = useTranslation("landingPage");

  const chartConfig = {
    products: {
      label: t("aboutData.numberOfProducts"),
      color: "hsl(var(--chart-1))",
    },
    sold: {
      label: t("aboutData.numberSold"),
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const [timeRange, setTimeRange] = useState(t("aboutData.90d"));

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === t("aboutData.30d")) {
      daysToSubtract = 30;
    } else if (timeRange === t("aboutData.7d")) {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{t("aboutData.chartTitle")}</CardTitle>
          <CardDescription>{t("aboutData.chartDescription")}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label={t("aboutData.select")}
          >
            <SelectValue placeholder={t("aboutData.last3Months")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value={t("aboutData.90d")} className="rounded-lg">
              {t("aboutData.last3Months")}
            </SelectItem>
            <SelectItem value={t("aboutData.30d")} className="rounded-lg">
              {t("aboutData.last30Days")}
            </SelectItem>
            <SelectItem value={t("aboutData.7d")} className="rounded-lg">
              {t("aboutData.last7Days")}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillProducts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-products)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-products)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSold" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sold)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sold)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="products"
              type="natural"
              fill="url(#fillProducts)"
              stroke="var(--color-products)"
              stackId="a"
            />
            <Area
              dataKey="sold"
              type="natural"
              fill="url(#fillSold)"
              stroke="var(--color-sold)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AboutDataFirstChart;
