
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function KpiCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend, 
  trendValue,
  className 
}: KpiCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            <span 
              className={cn(
                "text-xs font-medium",
                trend === "up" && "text-green-500",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {trend === "up" && "↑ "}
              {trend === "down" && "↓ "}
              {trend === "neutral" && "→ "}
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
