
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartData } from "@/types";
import { cn } from "@/lib/utils";

interface PerformanceChartProps {
  data: ChartData[];
  className?: string;
}

export function PerformanceChart({ data, className }: PerformanceChartProps) {
  const [metric, setMetric] = useState("clicks");
  
  const formatValue = (value: number) => {
    if (metric === "cpc" || metric === "cpm" || metric === "cpa") {
      return `R$ ${value.toFixed(2)}`;
    } else if (metric === "conversion_rate") {
      return `${value.toFixed(2)}%`;
    } else {
      return value.toLocaleString();
    }
  };
  
  const getChartColor = () => {
    switch (metric) {
      case "clicks": return "#0576be";
      case "impressions": return "#472c9e";
      case "conversion_rate": return "#34aff2";
      case "cpc": return "#6748de";
      case "cpm": return "#075f9a";
      case "cpa": return "#5736c3";
      default: return "#0576be";
    }
  };

  return (
    <Card className={cn("col-span-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Desempenho ao longo do tempo</CardTitle>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecionar métrica" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clicks">Cliques</SelectItem>
            <SelectItem value="impressions">Impressões</SelectItem>
            <SelectItem value="conversion_rate">Taxa de conversão</SelectItem>
            <SelectItem value="cpc">CPC (Custo por clique)</SelectItem>
            <SelectItem value="cpm">CPM (Custo por mil)</SelectItem>
            <SelectItem value="cpa">CPA (Custo por aquisição)</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.8} />
                <stop offset="95%" stopColor={getChartColor()} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#f0f0f0" }}
            />
            <YAxis 
              tickFormatter={(value) => formatValue(value)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#f0f0f0" }}
            />
            <Tooltip 
              formatter={(value: number) => [formatValue(value), metric.replace('_', ' ')]}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={getChartColor()}
              fillOpacity={1}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
