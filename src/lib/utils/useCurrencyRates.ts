import { useState, useEffect, useMemo } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { API_BASE_URL } from "../utils/constants";
import { ExchangeRates, ExchangeRateResponse } from "./currency";
import { CurrencyConverter } from "../utils/currencyConverter";

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
          `${API_BASE_URL}dashboard/exchangeRates/${baseCurrency}`,
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

    if (baseCurrency && keycloak.token) {
      fetchRates();
    }
  }, [baseCurrency, keycloak.token]);

  // Create memoized converter instance
  const converter = useMemo(() => {
    return rates ? new CurrencyConverter(rates) : null;
  }, [rates]);

  return { rates, loading, error, converter };
};
