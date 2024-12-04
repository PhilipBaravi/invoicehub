import { FC, useEffect, useState } from "react"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useTranslation } from "react-i18next"
import keycloak from "@/components/main-authentication/new-login-page/keycloak"

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

// Mock data for sales
const totalSalesData = [
  { date: "2024-11-13", totalSales: 7500 },
  { date: "2024-11-14", totalSales: 9000 },
  { date: "2024-11-15", totalSales: 6000 },
  { date: "2024-11-16", totalSales: 13000 },
  { date: "2024-11-17", totalSales: 14500 },
]

const ProductSalesChart: FC = () => {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("productsSold")
  const [loading, setLoading] = useState(false)
  const [productSalesData, setProductSalesData] = useState<any[]>([])
  const { t } = useTranslation('dashboardDefault')

  useEffect(() => {
    const fetchProductSalesData = async () => {
      setLoading(true)
      try {
        const year = 2024
        const month = 11
        const response = await fetch(`https://invoicehub-lb-1106916193.us-east-1.elb.amazonaws.com/api/v1/dashboard/soldProductsBy/${year}/${month}`, {
          headers: {
            'Authorization': `Bearer ${keycloak.token}`,
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (data.success && data.data) {
          const fetchedData = data.data
          const productsSoldArray = Object.keys(fetchedData).map((key) => {
            const dateStr = key // e.g., "November 13"
            const day = parseInt(dateStr.split(' ')[1])
            const monthName = dateStr.split(' ')[0]
            const date = new Date(`${monthName} ${day}, ${year}`)
            const formattedDate = date.toISOString().split('T')[0] 
            return {
              date: formattedDate,
              productsSold: fetchedData[key],
            }
          })

          const mergedData = productsSoldArray.map(item => {
            const totalSalesItem = totalSalesData.find(tsItem => tsItem.date === item.date)
            return {
              date: item.date,
              productsSold: item.productsSold,
              totalSales: totalSalesItem ? totalSalesItem.totalSales : 0
            }
          })

          setProductSalesData(mergedData)
        } else {
          // Handle error or empty data
          setProductSalesData([])
        }
      } catch (error) {
        console.error('Error fetching product sales data:', error)
        setProductSalesData([])
      } finally {
        setLoading(false)
      }
    }

    fetchProductSalesData()
  }, [])

  // Trigger loading on window resize
  useEffect(() => {
    const handleResize = () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 500) // Display loading for 500ms after resize
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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
    [productSalesData]
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
              className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
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
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <span className="text-lg font-semibold">Loading...</span>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}

export default ProductSalesChart
