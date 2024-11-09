import { FC } from "react"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useTranslation } from "react-i18next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Sample product sales data
const productSalesData = [
  { date: "2024-04-01", productsSold: 150, totalSales: 7500 },
  { date: "2024-04-02", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-03", productsSold: 120, totalSales: 6000 },
  { date: "2024-04-04", productsSold: 260, totalSales: 13000 },
  { date: "2024-04-05", productsSold: 290, totalSales: 14500 },
  { date: "2024-04-06", productsSold: 340, totalSales: 17000 },
  { date: "2024-04-07", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-01", productsSold: 150, totalSales: 7500 },
  { date: "2024-04-02", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-03", productsSold: 120, totalSales: 6000 },
  { date: "2024-04-04", productsSold: 260, totalSales: 13000 },
  { date: "2024-04-05", productsSold: 290, totalSales: 14500 },
  { date: "2024-04-06", productsSold: 340, totalSales: 17000 },
  { date: "2024-04-07", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-01", productsSold: 150, totalSales: 7500 },
  { date: "2024-04-02", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-03", productsSold: 120, totalSales: 6000 },
  { date: "2024-04-04", productsSold: 260, totalSales: 13000 },
  { date: "2024-04-05", productsSold: 290, totalSales: 14500 },
  { date: "2024-04-06", productsSold: 340, totalSales: 17000 },
  { date: "2024-04-07", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-01", productsSold: 150, totalSales: 7500 },
  { date: "2024-04-02", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-03", productsSold: 120, totalSales: 6000 },
  { date: "2024-04-04", productsSold: 260, totalSales: 13000 },
  { date: "2024-04-05", productsSold: 290, totalSales: 14500 },
  { date: "2024-04-06", productsSold: 340, totalSales: 17000 },
  { date: "2024-04-07", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-01", productsSold: 150, totalSales: 7500 },
  { date: "2024-04-02", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-03", productsSold: 120, totalSales: 6000 },
  { date: "2024-04-04", productsSold: 260, totalSales: 13000 },
  { date: "2024-04-05", productsSold: 290, totalSales: 14500 },
  { date: "2024-04-06", productsSold: 340, totalSales: 17000 },
  { date: "2024-04-07", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-01", productsSold: 150, totalSales: 7500 },
  { date: "2024-04-02", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-03", productsSold: 120, totalSales: 6000 },
  { date: "2024-04-04", productsSold: 260, totalSales: 13000 },
  { date: "2024-04-05", productsSold: 290, totalSales: 14500 },
  { date: "2024-04-06", productsSold: 340, totalSales: 17000 },
  { date: "2024-04-07", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-01", productsSold: 150, totalSales: 7500 },
  { date: "2024-04-02", productsSold: 180, totalSales: 9000 },
  { date: "2024-04-03", productsSold: 120, totalSales: 6000 },
  { date: "2024-04-04", productsSold: 260, totalSales: 13000 },
  { date: "2024-04-05", productsSold: 290, totalSales: 14500 },
  { date: "2024-04-06", productsSold: 340, totalSales: 17000 },
  { date: "2024-04-07", productsSold: 180, totalSales: 9000 },
  // ... Add more data points as needed
]

const ProductSalesChart: FC = () => {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("productsSold")
  const { t } = useTranslation('dashboardDefault')
  const chartConfig = {
    productsSold: {
      label: t('productSalesChart.productsSold'),
      color: "hsl(var(--chart-1))",
    },
    totalSales: {
      label: t('productSalesChart.totalSales') + " $",
      color: "hsl(var(--chart-2))",
    },
  }
  
  const total = React.useMemo(
    () => ({
      productsSold: productSalesData.reduce((acc, curr) => acc + curr.productsSold, 0),
      totalSales: productSalesData.reduce((acc, curr) => acc + curr.totalSales, 0),
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{t('productSalesChart.title')}</CardTitle>
          <CardDescription>
            {t('productSalesChart.dataDescription')}
          </CardDescription>
        </div>
        <div className="flex">
          {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {key === 'totalSales' ? '$' : ''}
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={productSalesData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ProductSalesChart