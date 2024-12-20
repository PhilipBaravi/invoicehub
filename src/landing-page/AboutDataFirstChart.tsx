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
const chartData = [
  { date: "2024-04-01", products: 222, sold: 150 },
  { date: "2024-04-02", products: 97, sold: 180 },
  { date: "2024-04-03", products: 167, sold: 120 },
  { date: "2024-04-04", products: 242, sold: 260 },
  { date: "2024-04-05", products: 373, sold: 290 },
  { date: "2024-04-06", products: 301, sold: 340 },
  { date: "2024-04-07", products: 245, sold: 180 },
  { date: "2024-04-08", products: 409, sold: 320 },
  { date: "2024-04-09", products: 59, sold: 110 },
  { date: "2024-04-10", products: 261, sold: 190 },
  { date: "2024-04-11", products: 327, sold: 350 },
  { date: "2024-04-12", products: 292, sold: 210 },
  { date: "2024-04-13", products: 342, sold: 380 },
  { date: "2024-04-14", products: 137, sold: 220 },
  { date: "2024-04-15", products: 120, sold: 170 },
  { date: "2024-04-16", products: 138, sold: 190 },
  { date: "2024-04-17", products: 446, sold: 360 },
  { date: "2024-04-18", products: 364, sold: 410 },
  { date: "2024-04-19", products: 243, sold: 180 },
  { date: "2024-04-20", products: 89, sold: 150 },
  { date: "2024-04-21", products: 137, sold: 200 },
  { date: "2024-04-22", products: 224, sold: 170 },
  { date: "2024-04-23", products: 138, sold: 230 },
  { date: "2024-04-24", products: 387, sold: 290 },
  { date: "2024-04-25", products: 215, sold: 250 },
  { date: "2024-04-26", products: 75, sold: 130 },
  { date: "2024-04-27", products: 383, sold: 420 },
  { date: "2024-04-28", products: 122, sold: 180 },
  { date: "2024-04-29", products: 315, sold: 240 },
  { date: "2024-04-30", products: 454, sold: 380 },
  { date: "2024-05-01", products: 165, sold: 220 },
  { date: "2024-05-02", products: 293, sold: 310 },
  { date: "2024-05-03", products: 247, sold: 190 },
  { date: "2024-05-04", products: 385, sold: 420 },
  { date: "2024-05-05", products: 481, sold: 390 },
  { date: "2024-05-06", products: 498, sold: 520 },
  { date: "2024-05-07", products: 388, sold: 300 },
  { date: "2024-05-08", products: 149, sold: 210 },
  { date: "2024-05-09", products: 227, sold: 180 },
  { date: "2024-05-10", products: 293, sold: 330 },
  { date: "2024-05-11", products: 335, sold: 270 },
  { date: "2024-05-12", products: 197, sold: 240 },
  { date: "2024-05-13", products: 197, sold: 160 },
  { date: "2024-05-14", products: 448, sold: 490 },
  { date: "2024-05-15", products: 473, sold: 380 },
  { date: "2024-05-16", products: 338, sold: 400 },
  { date: "2024-05-17", products: 499, sold: 420 },
  { date: "2024-05-18", products: 315, sold: 350 },
  { date: "2024-05-19", products: 235, sold: 180 },
  { date: "2024-05-20", products: 177, sold: 230 },
  { date: "2024-05-21", products: 82, sold: 140 },
  { date: "2024-05-22", products: 81, sold: 120 },
  { date: "2024-05-23", products: 252, sold: 290 },
  { date: "2024-05-24", products: 294, sold: 220 },
  { date: "2024-05-25", products: 201, sold: 250 },
  { date: "2024-05-26", products: 213, sold: 170 },
  { date: "2024-05-27", products: 420, sold: 460 },
  { date: "2024-05-28", products: 233, sold: 190 },
  { date: "2024-05-29", products: 78, sold: 130 },
  { date: "2024-05-30", products: 340, sold: 280 },
  { date: "2024-05-31", products: 178, sold: 230 },
  { date: "2024-06-01", products: 178, sold: 200 },
  { date: "2024-06-02", products: 470, sold: 410 },
  { date: "2024-06-03", products: 103, sold: 160 },
  { date: "2024-06-04", products: 439, sold: 380 },
  { date: "2024-06-05", products: 88, sold: 140 },
  { date: "2024-06-06", products: 294, sold: 250 },
  { date: "2024-06-07", products: 323, sold: 370 },
  { date: "2024-06-08", products: 385, sold: 320 },
  { date: "2024-06-09", products: 438, sold: 480 },
  { date: "2024-06-10", products: 155, sold: 200 },
  { date: "2024-06-11", products: 92, sold: 150 },
  { date: "2024-06-12", products: 492, sold: 420 },
  { date: "2024-06-13", products: 81, sold: 130 },
  { date: "2024-06-14", products: 426, sold: 380 },
  { date: "2024-06-15", products: 307, sold: 350 },
  { date: "2024-06-16", products: 371, sold: 310 },
  { date: "2024-06-17", products: 475, sold: 520 },
  { date: "2024-06-18", products: 107, sold: 170 },
  { date: "2024-06-19", products: 341, sold: 290 },
  { date: "2024-06-20", products: 408, sold: 450 },
  { date: "2024-06-21", products: 169, sold: 210 },
  { date: "2024-06-22", products: 317, sold: 270 },
  { date: "2024-06-23", products: 480, sold: 530 },
  { date: "2024-06-24", products: 132, sold: 180 },
  { date: "2024-06-25", products: 141, sold: 190 },
  { date: "2024-06-26", products: 434, sold: 380 },
  { date: "2024-06-27", products: 448, sold: 490 },
  { date: "2024-06-28", products: 149, sold: 200 },
  { date: "2024-06-29", products: 103, sold: 160 },
  { date: "2024-06-30", products: 215, sold: 250 },
];

const AboutDataFirstChart: FC = () => {
  const { t } = useTranslation("landingPage"); // Moved here

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
