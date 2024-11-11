import { FC } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Transaction {
  id: string
  customer: string
  email: string
  type: string
  status: "approved" | "pending" | "rejected"
  amount: number
}

const transactions: Transaction[] = [
  { id: "1", customer: "Liam Johnson", email: "liam@example.com", type: "Sale", status: "approved", amount: 250.00 },
  { id: "2", customer: "Emma Wilson", email: "emma@example.com", type: "Refund", status: "pending", amount: 180.00 },
  { id: "3", customer: "Noah Brown", email: "noah@example.com", type: "Purchase", status: "approved", amount: 350.00 },
  { id: "4", customer: "Olivia Davis", email: "olivia@example.com", type: "Sale", status: "rejected", amount: 120.00 },
]

const TransactionsCard: FC = () => {
  const { t } = useTranslation('dashboardDefault')

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>{t('transactionsCard.title')}</CardTitle>
          <CardDescription>{t('transactionsCard.titleDescription')}</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link to="/transactions" className="inline-flex items-center">
            {t('transactionsCard.viewAll')}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">{t('transactionsCard.customer')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('transactionsCard.customerType')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('transactionsCard.customerStatus')}</TableHead>
              <TableHead className="text-right">{t('transactionsCard.customerAmount')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  <div>{transaction.customer}</div>
                  <div className="text-sm text-muted-foreground">{transaction.email}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.type}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge 
                    variant={
                      transaction.status === "approved" ? "default" : 
                      transaction.status === "pending" ? "secondary" : "destructive"
                    }
                    className={
                      transaction.status === "approved" ? "bg-green-500" :
                      transaction.status === "pending" ? "bg-yellow-500" : ""
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default TransactionsCard