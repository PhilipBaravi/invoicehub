import { useEffect, useState, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Euro, PoundSterling, JapaneseYen, TrendingUp, TrendingDown } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useKeycloak } from "@react-keycloak/web";

interface ExchangeRate {
  code: string;
  rate: number;
  change: number;
  icon: React.ReactNode;
}

const CurrencyExchangeRates: FC = () => {
  const { keycloak } = useKeycloak();
  const { t, i18n } = useTranslation("dashboardDefault");
  const [rates, setRates] = useState<ExchangeRate[]>([
    { code: "USD", rate: 0, change: 0, icon: <DollarSign className="h-5 w-5" /> },
    { code: "EUR", rate: 0, change: 0, icon: <Euro className="h-5 w-5" /> },
    { code: "GBP", rate: 0, change: 0, icon: <PoundSterling className="h-5 w-5" /> },
    { code: "JPY", rate: 0, change: 0, icon: <JapaneseYen className="h-5 w-5" /> },
  ]);
  const [baseCurrency, setBaseCurrency] = useState<string>("GEL");

  const getExchangeRatesData = async () => {
    try {
      const response = await fetch('https://api.invoicehub.space/api/v1/dashboard/exchangeRates', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    getExchangeRatesData();
  })
  useEffect(() => {
    // Update base currency based on language
    const currentLanguage = i18n.language || "en";
    const newBaseCurrency =
      currentLanguage === "en" ? "USD" : currentLanguage === "es" ? "EUR" : "GEL";
    setBaseCurrency(newBaseCurrency);
  }, [i18n.language]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/ba9f3a428c2c3f6d832c136a/latest/${baseCurrency}`
        );
        const data = response.data;

        if (data.result === "success") {
          const newRates = rates.map((rate) => ({
            ...rate,
            rate: data.conversion_rates[rate.code] || 0,
            change: parseFloat((Math.random() * 10 - 5).toFixed(2)), // Simulating change
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
  }, [baseCurrency]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {rates.map((rate) => (
        <Card key={rate.code} className="overflow-hidden transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {rate.code} / {baseCurrency}
            </CardTitle>
            <div className="rounded-full bg-primary/10 p-1">{rate.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rate.rate.toFixed(4)}</div>
            <div className="flex items-center mt-2">
              <div
                className={`text-sm font-medium flex items-center ${
                  rate.change > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {rate.change > 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                {rate.change > 0 ? "+" : ""}
                {rate.change}%
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {t("currencyExchanges.lastMonth")}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrencyExchangeRates;
