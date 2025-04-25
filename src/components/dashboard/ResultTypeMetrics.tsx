
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricsCard } from "./MetricsCard";
import { BarChart3, DollarSign, MousePointer, Users } from "lucide-react";
import { Campaign, ResultsByType } from "@/types";
import { formatCurrency, formatMetric } from "@/utils/metricCalculations";

interface ResultTypeMetricsProps {
  resultsByType: ResultsByType;
  cpaByType: Record<string, number>;
  campaigns: Campaign[];
}

export function ResultTypeMetrics({ resultsByType, cpaByType, campaigns }: ResultTypeMetricsProps) {
  const [selectedType, setSelectedType] = useState<string>(
    Object.keys(resultsByType)[0] || "All"
  );

  // Filter campaigns by selected type
  const filteredCampaigns = campaigns.filter(
    campaign => selectedType === "All" || campaign.tipo_resultado === selectedType
  );

  // Calculate metrics for filtered campaigns - handling nulls and non-numeric values
  const totalSpent = filteredCampaigns.reduce((sum, campaign) => {
    const spent = typeof campaign.spent === 'number' ? campaign.spent : 0;
    return sum + spent;
  }, 0);
  
  const totalImpressions = filteredCampaigns.reduce((sum, campaign) => {
    const impressions = typeof campaign.impressions === 'number' ? campaign.impressions : 0;
    return sum + impressions;
  }, 0);
  
  const totalClicks = filteredCampaigns.reduce((sum, campaign) => {
    const clicks = typeof campaign.clicks === 'number' ? campaign.clicks : 0;
    return sum + clicks;
  }, 0);
  
  const totalReach = filteredCampaigns.reduce((sum, campaign) => {
    const reach = typeof campaign.reach === 'number' ? campaign.reach : 0;
    return sum + reach;
  }, 0);
  
  // Calculate CPM and CPC for filtered campaigns
  const cpm = totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0;
  const cpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
  const cpa = selectedType !== "All" && cpaByType[selectedType] ? cpaByType[selectedType] : 0;
  
  // Get total results for the selected type
  const totalResults = selectedType !== "All" && resultsByType[selectedType] 
    ? resultsByType[selectedType].count 
    : Object.values(resultsByType).reduce((sum, data) => sum + data.count, 0);

  const resultTypeOptions = ["All", ...Object.keys(resultsByType)];

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Metrics by Result Type</CardTitle>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select result type" />
          </SelectTrigger>
          <SelectContent>
            {resultTypeOptions.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Invested"
            value={formatCurrency(totalSpent)}
            icon={DollarSign}
            change={{ value: formatCurrency(1200), percentage: "+15%", isPositive: true }}
          />
          <MetricsCard
            title="CPM"
            value={formatCurrency(cpm)}
            icon={Users}
            change={{ value: formatCurrency(0.5), percentage: "-5%", isPositive: false }}
          />
          <MetricsCard
            title="CPC"
            value={formatCurrency(cpc)}
            icon={MousePointer}
            change={{ value: formatCurrency(0.1), percentage: "+2%", isPositive: true }}
          />
          <MetricsCard
            title="CPA"
            value={formatCurrency(cpa)}
            icon={BarChart3}
            change={{ value: formatCurrency(1.5), percentage: "-8%", isPositive: true }}
          />
          <MetricsCard
            title="Reach"
            value={formatMetric(totalReach)}
            icon={Users}
            change={{ value: formatMetric(5000), percentage: "+20%", isPositive: true }}
          />
          <MetricsCard
            title="Impressions"
            value={formatMetric(totalImpressions)}
            icon={Users}
            change={{ value: formatMetric(7500), percentage: "+12%", isPositive: true }}
          />
          <MetricsCard
            title="Clicks"
            value={formatMetric(totalClicks)}
            icon={MousePointer}
            change={{ value: formatMetric(250), percentage: "+5%", isPositive: true }}
          />
          <MetricsCard
            title="Results"
            value={formatMetric(totalResults)}
            icon={BarChart3}
            change={{ value: formatMetric(45), percentage: "+18%", isPositive: true }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
