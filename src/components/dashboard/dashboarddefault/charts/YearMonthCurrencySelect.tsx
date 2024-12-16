import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface YearMonthCurrencySelectProps {
  year: number
  month: number
  currency: string
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  onCurrencyChange: (currency: string) => void
}

const currencies = ["USD", "EUR", "GEL"]
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export const YearMonthCurrencySelect: React.FC<YearMonthCurrencySelectProps> = ({
  year,
  month,
  currency,
  onYearChange,
  onMonthChange,
  onCurrencyChange
}) => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={year.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={month.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m, index) => (
            <SelectItem key={index} value={(index + 1).toString()}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

