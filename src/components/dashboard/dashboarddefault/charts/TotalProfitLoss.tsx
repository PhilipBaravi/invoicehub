import * as React from "react"
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Label, Pie, PieChart } from "recharts"
import { useKeycloak } from "@react-keycloak/web"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { YearMonthCurrencySelect } from "./YearMonthCurrencySelect"
import { NoDataDisplay } from "./NoDataDisplay"

interface FinancialSummaryData {
  total_cost: number
  total_profit_loss: number
  total_sales: number
}

interface ApiResponse {
  success: boolean
  message: string
  code: number
  data: FinancialSummaryData
}

const chartConfig: ChartConfig = {
  financialSummary: {
    label: "Financial Summary",
  },
  total_profit: {
    label: "Total Profit",
    color: "hsl(var(--chart-2))",
  },
  total_loss: {
    label: "Total Loss",
    color: "hsl(var(--chart-1))",
  },
  total_spent: {
    label: "Total Spent",
    color: "hsl(var(--chart-3))",
  }
}

const currencySymbols: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GEL: "₾"
}

const TotalProfitLoss = () => {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = React.useState(currentYear)
  const [month, setMonth] = React.useState(new Date().getMonth() + 1)
  const [currency, setCurrency] = React.useState("USD")
  const [chartData, setChartData] = React.useState<FinancialSummaryData | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { keycloak, initialized } = useKeycloak()

  const fetchData = async (year: number, month: number, currency: string) => {
    if (!initialized || !keycloak.authenticated) {
      return null
    }
    const response = await fetch(
      `http://localhost:9090/api/v1/dashboard/financialSummary/${year}/${month}/${currency}`,
      {
        headers: {
          'Authorization': `Bearer ${keycloak.token}`
        }
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result: ApiResponse = await response.json()
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch data')
    }
    return result.data
  }

  React.useEffect(() => {
    const loadData = async () => {
      if (!initialized || !keycloak.authenticated) {
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchData(year, month, currency)
        if (data) {
          setChartData(data)
        } else {
          setError("No data available")
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError("No data available")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [initialized, keycloak.authenticated, year, month, currency])

  const formattedChartData = React.useMemo(() => {
    if (!chartData) return []
    const { total_sales, total_profit_loss } = chartData

    const isLoss = total_profit_loss < 0
    const profitLossValue = isLoss ? Math.abs(total_profit_loss) : total_profit_loss
    const profitLossLabel = isLoss ? "Total Loss" : "Total Profit"

    // Calculate total spent (cost) from the formula: total_sales - total_profit_loss
    const totalSpent = total_sales - total_profit_loss

    return [
      {
        name: profitLossLabel,
        value: profitLossValue,
        fill: isLoss ? "var(--color-total_loss)" : "var(--color-total_profit)",
      },
      {
        name: "Total Spent",
        value: totalSpent,
        fill: "var(--color-total_spent)",
      },
    ]
  }, [chartData])

  if (!initialized) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p>Initializing...</p>
        </CardContent>
      </Card>
    )
  }

  if (!keycloak.authenticated) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p>Please log in to view the chart.</p>
        </CardContent>
      </Card>
    )
  }

  const showFooter = !error && chartData && chartData.total_sales > 0
  const isLoss = (chartData?.total_profit_loss ?? 0) < 0
  const profitLossLabel = isLoss ? "Total Loss" : "Total Profit"
  const profitLossValue = isLoss
    ? Math.abs(chartData?.total_profit_loss ?? 0)
    : chartData?.total_profit_loss ?? 0

  // Compute total spent dynamically
  const totalSpent = chartData ? chartData.total_sales - chartData.total_profit_loss : 0

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 space-y-2">
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>{`${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`}</CardDescription>
        <YearMonthCurrencySelect
          year={year}
          month={month}
          currency={currency}
          onYearChange={setYear}
          onMonthChange={setMonth}
          onCurrencyChange={setCurrency}
        />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <p>Loading chart data...</p>
          </div>
        ) : error ? (
          <NoDataDisplay />
        ) : chartData ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Pie
                data={formattedChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const totalSalesString = chartData.total_sales.toLocaleString();
                      const fontSize = totalSalesString.length > 4 ? 20 : totalSalesString.length > 2 ? 24 : 28;
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground font-bold"
                            style={{ fontSize: `${fontSize}px` }}
                          >
                            {currencySymbols[currency]}{totalSalesString}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            Total Sales
                          </tspan>
                        </text>
                      )
                    }
                    return null
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : null}
      </CardContent>
      {showFooter && chartData && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {isLoss ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
            {profitLossLabel}: {currencySymbols[currency]}{profitLossValue.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 font-medium leading-none">
            <TrendingDown className="h-4 w-4 text-yellow-500" />
            Total Spent: {currencySymbols[currency]}{totalSpent.toLocaleString()}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default TotalProfitLoss
