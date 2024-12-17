import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NoDataDisplay } from "./charts/NoDataDisplay";
import { useKeycloak } from "@react-keycloak/web";

interface Address {
  id: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface Company {
  id: number;
  title: string;
  phone: string;
  website: string;
  email: string;
  address: Address;
}

interface ClientVendor {
  id: number;
  name: string;
  phone: string;
  website: string;
  email: string;
  clientVendorType: string;
  address: Address;
}

interface Invoice {
  id: number;
  invoiceNo: string;
  invoiceStatus: string;
  invoiceType: string;
  dateOfIssue: string;
  dueDate: string;
  acceptDate: string;
  paymentTerms: string;
  notes: string;
  company: Company;
  clientVendor: ClientVendor;
  price: number;
  currency: string;
  tax: number;
  total: number;
}

const RecentSales: FC = () => {
  const { t } = useTranslation('charts');
  const { keycloak } = useKeycloak();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const fetchRecentlyApproved = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.invoicehub.space/api/v1/dashboard/recentlyApproved", {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setInvoices(result.data);
      } else {
        setInvoices([]);
        setError(t('recentSales.noDataAvailable'));
      }
    } catch (err) {
      console.error(t('recentSales.fetchError'), err);
      setInvoices([]);
      setError(t('recentSales.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keycloak && keycloak.token) {
      fetchRecentlyApproved();
    }
  }, [keycloak.token]);

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{t('recentSales.title')}</CardTitle>
          <Badge variant="secondary" className="text-sm font-medium">
            {t('recentSales.invoiceCount', { count: invoices.length })}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('recentSales.description')}
        </p>
      </CardHeader>
      <CardContent className="p-6 overflow-y-auto flex-grow">
        {loading ? (
          <div className="text-center">{t('recentSales.loading')}</div>
        ) : invoices.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => {
              const initials = invoice.clientVendor.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={invoice.id}
                  className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={""} alt={t('recentSales.avatarAlt')} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {invoice.clientVendor.name}
                      </p>
                      <Badge variant="default" className="ml-2">
                        +{invoice.currency === "USD" ? "$" : ""}
                        {invoice.total.toFixed(2)}
                        {invoice.currency !== "USD" ? ` ${invoice.currency}` : ""}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {invoice.clientVendor.email}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSales;

