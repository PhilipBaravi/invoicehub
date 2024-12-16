import { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NoDataDisplay } from "./charts/NoDataDisplay";

interface Sale {
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: number;
}

const sales: Sale[] = [
  {
    customer: {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      avatar: "/placeholder.svg",
    },
    amount: 1999.0,
  },
  {
    customer: {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      avatar: "/placeholder.svg",
    },
    amount: 39.0,
  },
  {
    customer: {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      avatar: "/placeholder.svg",
    },
    amount: 299.0,
  },
  {
    customer: {
      name: "William Kim",
      email: "will@email.com",
      avatar: "/placeholder.svg",
    },
    amount: 99.0,
  },
  {
    customer: {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      avatar: "/placeholder.svg",
    },
    amount: 39.0,
  },
];

const RecentSales: FC = () => {
  return (
    <Card className="w-full overflow-hidden h-[500px]">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Recent Sales</CardTitle>
          <Badge variant="secondary" className="text-sm font-medium">
            265 Sales
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of recent transactions and customer details
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {sales.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.customer.email}
                className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={sale.customer.avatar} alt="Avatar" />
                  <AvatarFallback>
                    {sale.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {sale.customer.name}
                    </p>
                    <Badge variant="default" className="ml-2">
                      +${sale.amount.toFixed(2)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {sale.customer.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSales;
