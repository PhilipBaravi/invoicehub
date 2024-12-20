import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";

interface ExchangeRates {
  [key: string]: number;
}

interface ExchangeRateResponse {
  success: boolean;
  message: string;
  code: number;
  data: ExchangeRates;
}

export const useCurrencyRates = (baseCurrency: string) => {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { keycloak } = useKeycloak();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api/invoicehub.space/api/v1/dashboard/exchangeRates/${baseCurrency}`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
        const data: ExchangeRateResponse = await response.json();

        if (data.success) {
          setRates(data.data);
          setError(null);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch exchange rates");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency]);

  return { rates, loading, error };
};
