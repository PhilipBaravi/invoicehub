import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "react-i18next"

interface YearMonthCurrencySelectProps {
  year: number
  month: number
  currency: string
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  onCurrencyChange: (currency: string) => void
}

const currencies = ["USD", "EUR", "GEL"]
const months = Array.from({ length: 12 }, (_, i) => i + 1)

export const YearMonthCurrencySelect: React.FC<YearMonthCurrencySelectProps> = ({
  year,
  month,
  currency,
  onYearChange,
  onMonthChange,
  onCurrencyChange
}) => {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation('charts')

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={year.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={t('dateSelect.selectYear')} />
        </SelectTrigger>
        <SelectContent>
          {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={month.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={t('dateSelect.selectMonth')} />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m} value={m.toString()}>{t(`dateSelect.months.${m}`)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={t('dateSelect.selectCurrency')} />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((c) => (
            <SelectItem key={c} value={c}>{t(`dateSelect.currencies.${c}`)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

