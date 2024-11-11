import { FC, useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { useKeycloak } from "@react-keycloak/web"

type FinancialSummary = {
  name: string
  value: number
}

const COLORS = ['#0088FE', '#00C49F', '#5b21b6']

const FinancialSummaryChart: FC = () => {
  const { keycloak } = useKeycloak()
  const [data, setData] = useState<FinancialSummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFinancialSummary = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/dashboard/summaryNumbers', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })

      const result = await response.json()

      if (result.success && result.data) {
        const transformedData = [
          { name: "Total Cost", value: result.data.total_cost },
          { name: "Total Profit/Loss", value: result.data.total_profit_loss },
          { name: "Total Sales", value: result.data.total_sales },
        ]
        setData(transformedData)
      } else {
        console.error("Failed to fetch financial summary data:", result.message)
      }
    } catch (error) {
      console.error("An error occurred while fetching financial summary data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (keycloak && keycloak.token) {
      fetchFinancialSummary()
    }
  }, [keycloak.token])

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Financial Summary</CardTitle>
          <CardDescription>An overview of costs, profit/loss, and sales</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {loading ? (
          <div className="text-lg font-semibold">Loading...</div>
        ) : (
          <ChartContainer
            config={{
              totalCost: {
                label: "Total Cost",
                color: COLORS[0],
              },
              profitLoss: {
                label: "Total Profit/Loss",
                color: COLORS[1],
              },
              totalSales: {
                label: "Total Sales",
                color: COLORS[2],
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
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
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {data.name}
                              </span>
                              <span className="font-bold text-muted-foreground">
                                ${data.value.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Percentage
                              </span>
                              <span className="font-bold">
                                {((data.value / total) * 100).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default FinancialSummaryChart
