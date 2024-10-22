import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CurrencyExchangeRates from "./CurrencyExchangeRates";
import ProductSalesChart from "./ProductSalesChart";
import { ArrowUpRight, TrendingUp, Users, ShoppingBag, GripVertical } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropResult } from "react-beautiful-dnd";

const DashboardDefault: FC = () => {
  const [components, setComponents] = useState([
    { id: "currency", title: "Currency Exchange Rates", component: <CurrencyExchangeRates />, width: "col-span-full" },
    { id: "productSales", title: "Product Sales Chart", component: <ProductSalesChart />, width: "col-span-full" },
    { id: "stats", title: "Statistics", component: <StatisticsGrid />, width: "col-span-full" },
    { id: "transactions", title: "Transactions", component: <TransactionsCard />, width: "col-span-1 md:col-span-2" },
    { id: "recentSales", title: "Recent Sales", component: <RecentSalesCard />, width: "col-span-1" },
  ]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const items = [...components];
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    setComponents(items);
  };

  return (
    <>
      <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 px-6">
        Hi, welcome back 👋
      </h1>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 w-full px-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="dashboard">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
                {components.map((component, index) => (
                  <Draggable key={component.id} draggableId={component.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-background rounded-lg shadow-md p-4 ${component.width} overflow-hidden w-full`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold">{component.title}</h2>
                          <GripVertical className="text-muted-foreground cursor-move" />
                        </div>
                        {component.component}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>
    </>
  );
};

const StatisticsGrid: FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 auto-rows-min">
      <StatCard
        title="Top Products"
        value="5,234"
        description="Total sales"
        icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
        trend="+12.5%"
      />
      <StatCard
        title="Employees"
        value="12"
        description="Active members"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend="+2.5%"
      />
      <StatCard
        title="Clients"
        value="3,456"
        description="Total customers"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend="+5.2%"
      />
      <StatCard
        title="Sales"
        value="$89,456"
        description="Total revenue"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        trend="+18.7%"
      />
    </div>
  );
};

const TransactionsCard: FC = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent transactions from your store.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link to="/transactions">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden xl:table-column">Type</TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="hidden xl:table-column">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  liam@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Sale</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2023-06-23
              </TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const RecentSalesCard: FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, description, icon, trend }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-2 flex items-center text-sm text-green-600">
          <TrendingUp className="mr-1 h-4 w-4" />
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardDefault;
