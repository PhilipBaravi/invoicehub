import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { getCookie, setCookie } from "@/lib/utils/cookieUtils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "react-i18next";
import { YearMonthCurrencySelectProps, SavedPreferences } from "./types";

const COOKIE_NAME_PREFIX = "date-range-preferences";

export const YearMonthCurrencySelect: FC<YearMonthCurrencySelectProps> = ({
  id,
  year: initialYear,
  startMonth: initialStartMonth,
  endMonth: initialEndMonth,
  currency: initialCurrency,
  onYearChange,
  onStartMonthChange,
  onEndMonthChange,
  onCurrencyChange,
  showTotal: initialShowTotal,
  onShowTotalChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const cookieName = `${COOKIE_NAME_PREFIX}-${id}`;

  // Initialize state from cookies or props
  const initializeFromCookies = (): SavedPreferences => {
    const savedPreferences = getCookie(cookieName);
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      return parsed;
    }
    return {
      year: initialYear,
      startMonth: isFirstLoad ? 1 : initialStartMonth,
      endMonth: isFirstLoad ? 12 : initialEndMonth,
      currency: initialCurrency,
      showTotal: initialShowTotal,
    };
  };

  const [tempYear, setTempYear] = useState(initialYear);
  const [tempStartMonth, setTempStartMonth] = useState(
    isFirstLoad ? 1 : initialStartMonth
  );
  const [tempEndMonth, setTempEndMonth] = useState(
    isFirstLoad ? 12 : initialEndMonth
  );
  const [tempCurrency, setTempCurrency] = useState(initialCurrency);
  const [tempShowTotal, setTempShowTotal] = useState(initialShowTotal);
  const [monthRange, setMonthRange] = useState([
    isFirstLoad ? 1 : initialStartMonth,
    isFirstLoad ? 12 : initialEndMonth,
  ]);
  const { t } = useTranslation("charts");
  useEffect(() => {
    const preferences = initializeFromCookies();
    if (isFirstLoad) {
      setTempYear(preferences.year);
      setTempStartMonth(preferences.startMonth);
      setTempEndMonth(preferences.endMonth);
      setTempCurrency(preferences.currency);
      setTempShowTotal(preferences.showTotal);
      setMonthRange([preferences.startMonth, preferences.endMonth]);

      // Apply the preferences
      onYearChange(preferences.year);
      onStartMonthChange(preferences.startMonth);
      onEndMonthChange(preferences.endMonth);
      onCurrencyChange(preferences.currency);
      if (onShowTotalChange && preferences.showTotal !== undefined) {
        onShowTotalChange(preferences.showTotal);
      }

      setIsFirstLoad(false);
    }
  }, [
    isFirstLoad,
    onYearChange,
    onStartMonthChange,
    onEndMonthChange,
    onCurrencyChange,
    onShowTotalChange,
  ]);

  useEffect(() => {
    setMonthRange([tempStartMonth, tempEndMonth]);
  }, [tempStartMonth, tempEndMonth]);

  const handleApply = () => {
    const newPreferences: SavedPreferences = {
      year: tempYear,
      startMonth: tempStartMonth,
      endMonth: tempEndMonth,
      currency: tempCurrency,
      showTotal: tempShowTotal,
    };

    // Save to cookies
    setCookie(cookieName, JSON.stringify(newPreferences), 30); // 30 days

    onYearChange(tempYear);
    onStartMonthChange(tempStartMonth);
    onEndMonthChange(tempEndMonth);
    onCurrencyChange(tempCurrency);
    if (onShowTotalChange) {
      onShowTotalChange(tempShowTotal!);
    }
    setIsOpen(false);
  };

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1).toLocaleString("default", {
      month: "short",
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleMonthRangeChange = (values: number[]) => {
    setTempStartMonth(values[0]);
    setTempEndMonth(values[1]);
    setMonthRange(values);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-fit px-3 justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4 shrink-0" />
          <div className="flex items-center gap-1">
            <span className="font-medium">
              {getMonthName(tempStartMonth)} - {getMonthName(tempEndMonth)}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{tempYear}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{tempCurrency}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2 space-y-2">
              <Label htmlFor="year-select">{t("dateSelect.select.year")}</Label>
              <Select
                value={tempYear.toString()}
                onValueChange={(v) => setTempYear(Number(v))}
              >
                <SelectTrigger id="year-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2 space-y-2">
              <Label htmlFor="currency-select">
                {t("dateSelect.select.currency")}
              </Label>
              <Select value={tempCurrency} onValueChange={setTempCurrency}>
                <SelectTrigger id="currency-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GEL">GEL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>{t("dateSelect.select.monthRange")}</Label>
            <Slider
              min={1}
              max={12}
              step={1}
              value={monthRange}
              onValueChange={handleMonthRangeChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span>{getMonthName(monthRange[0])}</span>
              <span>{getMonthName(monthRange[1])}</span>
            </div>
          </div>

          {onShowTotalChange && (
            <div className="space-y-2">
              <Label htmlFor="total-select">
                {t("dateSelect.select.type")}
              </Label>
              <Select
                value={tempShowTotal ? "total" : "single"}
                onValueChange={(v) => setTempShowTotal(v === "total")}
              >
                <SelectTrigger id="total-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">
                    {t("dateSelect.select.singleCurrency")}
                  </SelectItem>
                  <SelectItem value="total">
                    {t("dateSelect.select.totalCurrencies")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t("dateSelect.select.cancel")}
            </Button>
            <Button onClick={handleApply}>
              {t("dateSelect.select.apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
