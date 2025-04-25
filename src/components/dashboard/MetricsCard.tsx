
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: {
    value: string;
    percentage: string;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricsCard({ title, value, icon: Icon, change, className }: MetricsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            
            {change && (
              <div className="mt-2 flex items-center">
                <span 
                  className={cn(
                    "text-xs font-medium",
                    change.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {change.isPositive ? "↑ " : "↓ "}
                  {change.value} ({change.percentage})
                </span>
              </div>
            )}
          </div>
          
          <div className="rounded-full p-2 bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        {/* Placeholder for mini chart */}
        <div className="mt-4 h-10 bg-slate-50 rounded">
          {/* This will be replaced with actual chart */}
        </div>
      </CardContent>
    </Card>
  );
}
