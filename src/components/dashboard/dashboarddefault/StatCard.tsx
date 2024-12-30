import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { TrendingUp } from "lucide-react";
import { FC } from "react";
import { StatCardProps } from "./charts/types";

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  onClick,
}) => {
  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-lg cursor-pointer hover:scale-[1.05]"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-2 flex items-center text-sm text-green-600">
          {/* <TrendingUp className="mr-1 h-4 w-4" /> */}
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
