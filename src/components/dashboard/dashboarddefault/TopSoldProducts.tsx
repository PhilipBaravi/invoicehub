import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package2, TrendingUp } from "lucide-react";
import { useKeycloak } from "@react-keycloak/web";
import { NoDataDisplay } from "./charts/NoDataDisplay";
import { YearMonthCurrencySelect } from "./charts/YearMonthCurrencySelect";

type Product = {
  name: string;
  quantity: number;
  amount: number;
  currency: string;
};

type ApiData = {
  [productName: string]: {
    quantity: number;
    amount: number;
    currency: string;
  };
};

const TopSoldProducts: FC = () => {
  const { t } = useTranslation("charts");
  const { keycloak } = useKeycloak();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [startMonth, setStartMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [endMonth, setEndMonth] = useState<number>(new Date().getMonth() + 1);
  const [currency, setCurrency] = useState<string>("USD");
  const [products, setProducts] = useState<Product[]>([]);
  const [totalSold, setTotalSold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const fetchTopProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api/invoicehub.space/api/v1/dashboard/topSellingProducts/${year}/${startMonth}/${endMonth}/${currency}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const data: ApiData = result.data;
        const productArray: Product[] = Object.entries(data).map(
          ([name, details]) => ({
            name,
            quantity: details.quantity,
            amount: details.amount,
            currency: details.currency,
          })
        );

        const sortedProducts = productArray.sort(
          (a, b) => b.quantity - a.quantity
        );

        setProducts(sortedProducts);
        setTotalSold(
          sortedProducts.reduce((sum, product) => sum + product.quantity, 0)
        );
      } else {
        setProducts([]);
        setError(t("topSoldProducts.noDataAvailable"));
      }
    } catch (err) {
      console.error(t("topSoldProducts.fetchError"), err);
      setProducts([]);
      setError(t("topSoldProducts.errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keycloak && keycloak.token) {
      fetchTopProducts();
    }
  }, [year, startMonth, endMonth, currency, keycloak.token]);

  const formatCurrency = (amount: number, currencyCode: string) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (e) {
      console.error(`Error formatting currency: ${currencyCode}`, e);
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  };

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            {t("topSoldProducts.title")}
          </CardTitle>
          <Badge variant="secondary" className="text-sm font-medium">
            {t("topSoldProducts.totalBadge", { total: totalSold })}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t("topSoldProducts.description")}
        </p>
        <div className="flex gap-2 mt-4">
          <YearMonthCurrencySelect
            year={year}
            startMonth={startMonth}
            endMonth={endMonth}
            currency={currency}
            onYearChange={setYear}
            onStartMonthChange={setStartMonth}
            onEndMonthChange={setEndMonth}
            onCurrencyChange={setCurrency}
            id="top-sold-products"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 overflow-y-auto flex-grow">
        {loading ? (
          <div className="text-center">{t("topSoldProducts.loading")}</div>
        ) : products.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mr-4">
                  <Package2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <Badge
                      variant={index === 0 ? "default" : "outline"}
                      className="ml-2"
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {t("topSoldProducts.quantitySold")}
                    </p>
                    <p className="text-sm font-semibold">{product.quantity}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {t("topSoldProducts.totalRevenue")}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(product.amount, product.currency)}
                    </p>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${
                          (product.quantity / (products[0]?.quantity || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopSoldProducts;
