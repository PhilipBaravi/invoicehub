import { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package2, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKeycloak } from "@react-keycloak/web";

interface Product {
  name: string;
  quantity: number;
  estimatedRevenue: number;
}

const currencies = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GEL: { symbol: "₾", rate: 2.65 },
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TopSoldProducts: FC = () => {
  const { keycloak } = useKeycloak();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, "0"));
  const [currency, setCurrency] = useState("USD");
  const [products, setProducts] = useState<Product[]>([]);
  const [totalSold, setTotalSold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const fetchTopProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.invoicehub.space/api/v1/dashboard/topSellingProducts/${year}/${month}/${currency}`,
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
        setProducts(result.data);
        setTotalSold(
          result.data.reduce((sum: number, product: Product) => sum + product.quantity, 0)
        );
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("An error occurred while fetching top-selling products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keycloak && keycloak.token) {
      fetchTopProducts();
    }
  }, [year, month, currency, keycloak.token]);

  const formatCurrency = (amount: number) => {
    const { symbol, rate } = currencies[currency as keyof typeof currencies];
    return `${symbol}${(amount * rate).toFixed(2)}`;
  };

  return (
    <Card className="w-full max-w-2xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Top Sold Products
          </CardTitle>
          <Badge variant="secondary" className="text-sm font-medium">
            {totalSold} Total
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Best performing products for the selected period
        </p>
        <div className="flex gap-2 mt-4">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, index) => (
                <SelectItem key={index} value={(index + 1).toString().padStart(2, "0")}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(currencies).map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="text-center">Loading...</div>
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
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <Badge
                      variant={index === 0 ? "default" : "outline"}
                      className="ml-2"
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">Quantity sold</p>
                    <p className="text-sm font-semibold">{product.quantity}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">Estimated revenue</p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(product.estimatedRevenue)}
                    </p>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${(product.quantity / products[0].quantity) * 100}%`,
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