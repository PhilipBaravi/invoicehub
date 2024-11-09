import { useEffect, useState, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Euro, PoundSterling, JapaneseYen } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface ExchangeRate {
  code: string;
  rate: number;
  change: number;
  icon: React.ReactNode;
}

const CurrencyExchangeRates: FC = () => {
  const { t } = useTranslation('dashboardDefault')
  const [rates, setRates] = useState<ExchangeRate[]>([
    { code: "USD", rate: 0, change: 0, icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
    { code: "EUR", rate: 0, change: 0, icon: <Euro className="h-4 w-4 text-muted-foreground" /> },
    { code: "GBP", rate: 0, change: 0, icon: <PoundSterling className="h-4 w-4 text-muted-foreground" /> },
    { code: "JPY", rate: 0, change: 0, icon: <JapaneseYen className="h-4 w-4 text-muted-foreground" /> },
  ]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(
          "https://v6.exchangerate-api.com/v6/ba9f3a428c2c3f6d832c136a/latest/GEL"
        );
        const data = response.data;

        if (data.result === "success") {
          const newRates = rates.map((rate) => ({
            ...rate,
            rate: 1 / data.conversion_rates[rate.code],
            change: parseFloat((Math.random() * 10 - 5).toFixed(1)), // Keep change as a number
          }));
          setRates(newRates);
        } else {
          throw new Error("Failed to fetch exchange rates");
        }
      } catch (err) {
        console.error("An error occurred while fetching exchange rates", err);
      }
    };

    fetchRates();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {rates.map((rate) => (
        <Card key={rate.code} >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{rate.code} / GEL</CardTitle>
            {rate.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rate.rate.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">
              {rate.change > 0 ? "+" : ""}
              {rate.change}% {t('currencyExchanges.lastMonth')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrencyExchangeRates;
