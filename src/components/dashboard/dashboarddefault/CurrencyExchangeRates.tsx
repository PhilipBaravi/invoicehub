import { useEffect, useState, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Euro, PoundSterling } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useKeycloak } from "@react-keycloak/web";
import { ExchangeRate } from "./charts/types";
import { API_BASE_URL } from "@/lib/utils/constants";
import StatCardSkeleton from "../skeletons/StatCardSkeleton";

interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, number>;
}

const CurrencyExchangeRates: FC = () => {
  const { i18n } = useTranslation("dashboardDefault");
  const { keycloak } = useKeycloak();
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<string>("GEL");
  const [loading, setLoading] = useState<boolean>(true);

  const currencyIcons: Record<string, React.ReactNode> = {
    USD: <DollarSign className="h-5 w-5" />,
    EUR: <Euro className="h-5 w-5" />,
    GBP: <PoundSterling className="h-5 w-5" />,
    CNY: <span className="h-5 w-5 font-bold">¥</span>,
    GEL: <span className="h-5 w-5 font-bold">₾</span>,
  };

  const currenciesToShow: Record<string, string[]> = {
    USD: ["EUR", "GBP", "CNY", "GEL"],
    EUR: ["USD", "GBP", "CNY", "GEL"],
    GEL: ["USD", "EUR", "GBP", "CNY"],
  };

  useEffect(() => {
    // Update base currency based on language
    const currentLanguage = i18n.language || "en";
    const newBaseCurrency =
      currentLanguage === "en"
        ? "USD"
        : currentLanguage === "es"
        ? "EUR"
        : "GEL";
    setBaseCurrency(newBaseCurrency);
  }, [i18n.language]);

  useEffect(() => {
    const fetchRates = async () => {
      if (!keycloak.token) return;

      setLoading(true);
      setRates([]);

      try {
        const response = await fetch(
          `${API_BASE_URL}dashboard/exchangeRates/${baseCurrency}`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success) {
          const data = result.data;

          const targetCurrencies = currenciesToShow[baseCurrency] || [];
          const newRates: ExchangeRate[] = targetCurrencies
            .filter((code) => data[code] !== undefined)
            .map((code) => {
              let displayedRate = data[code];
              let displayedCodePair: string;

              if (baseCurrency === "GEL") {
                // Currently data[code] = 1 GEL = data[code] * {code}
                // If {code}/GEL, so 1 {code} = 1/data[code] GEL
                displayedRate = 1 / displayedRate;
                displayedCodePair = `${code} / ${baseCurrency}`;
              } else {
                displayedCodePair = `${baseCurrency} / ${code}`;
              }

              return {
                code: displayedCodePair,
                rate: displayedRate,
                icon: currencyIcons[code] || null,
              };
            });

          setRates(newRates);
        } else {
          throw new Error(result.message || "Failed to fetch exchange rates");
        }
      } catch (err) {
        console.error("An error occurred while fetching exchange rates", err);
        setRates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, [baseCurrency, keycloak.token]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 auto-rows-min w-full">
        {[...Array(4)].map((_, index) => (
          <StatCardSkeleton
            key={index}
            styles="h-[122px] w-full max-w-[415px]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {loading ? (
        <div className="col-span-full text-center">Loading...</div>
      ) : (
        rates.map((rate, index) => (
          <Card
            key={`${rate.code}-${index}`}
            className="overflow-hidden transition-all hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{rate.code}</CardTitle>
              <div className="rounded-full bg-primary/10 p-1">{rate.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rate.rate.toFixed(4)}</div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CurrencyExchangeRates;
