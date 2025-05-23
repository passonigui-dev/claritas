import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { ActionPlan } from "@/components/dashboard/ActionPlan";
import { DataTrustHeader } from "@/components/dashboard/DataTrustHeader";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { ResultTypeMetrics } from "@/components/dashboard/ResultTypeMetrics";
import { AnalysisSummaryV2 } from "@/components/dashboard/AnalysisSummaryV2";
import { CampaignListV2 } from "@/components/dashboard/CampaignListV2";
import { DateFilter } from "@/components/dashboard/DateFilter";
import { 
  DollarSign, 
  MousePointer,
  BarChart3,
  Users
} from "lucide-react";
import { mockChartData, mockStrengths, mockWeaknesses, mockActions } from "@/data/mockData";
import { calculateMetrics, formatCurrency, formatMetric } from "@/utils/metricCalculations";
import { Campaign } from "@/types";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";

export default function Dashboard() {
  const { campaigns: googleSheetsCampaigns, isLoading, useMockData } = useGoogleSheets();
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  useEffect(() => {
    const storedData = localStorage.getItem('campaignData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setLocalCampaigns(Array.isArray(parsedData) ? parsedData : []);
        console.log('Loaded campaigns from localStorage:', parsedData);
      } catch (error) {
        console.error("Error processing stored campaign data:", error);
      }
    }
  }, []);

  const campaigns = googleSheetsCampaigns && googleSheetsCampaigns.length > 0 
    ? googleSheetsCampaigns 
    : localCampaigns.length > 0 
      ? localCampaigns 
      : []; // Don't use mock data for real metrics calculation

  console.log('Current data source:', {
    hasGoogleSheets: Boolean(googleSheetsCampaigns?.length),
    hasLocalStorage: Boolean(localCampaigns.length),
    usingEmptyArray: campaigns.length === 0,
    totalCampaigns: campaigns.length
  });

  const {
    totalSpent,
    totalImpressions,
    totalClicks,
    totalReach,
    cpm,
    cpc,
    resultsByType,
    cpaByType
  } = calculateMetrics(campaigns, dateRange.from, dateRange.to);

  console.log('Current date range:', dateRange);
  console.log('Calculated metrics with date range:', {
    totalSpent,
    campaignsLength: campaigns.length,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  return (
    <>
      <Navbar />
      <main className="py-8">
        <div className="container">
          {/* Data Trust Header */}
          <DataTrustHeader />
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Analysis of {campaigns.length} campaigns • 
                {isLoading ? 
                  " Updating data..." : 
                  ` Last update: ${new Date().toLocaleDateString('pt-BR')}`
                }
              </p>
            </div>
          </div>
          
          {/* Date Filter with handler */}
          <DateFilter onDateChange={(from, to) => setDateRange({ from, to })} />

          {/* Overall Metrics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              value={formatCurrency(Object.values(cpaByType).reduce((sum, val) => sum + val, 0) / Object.values(cpaByType).length || 0)}
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
              value={formatMetric(Object.values(resultsByType).reduce((sum, data) => sum + data.count, 0))}
              icon={BarChart3}
              change={{ value: formatMetric(45), percentage: "+18%", isPositive: true }}
            />
          </div>

          {/* Metrics by Result Type Section */}
          <ResultTypeMetrics 
            resultsByType={resultsByType} 
            cpaByType={cpaByType} 
            campaigns={campaigns.filter(campaign => {
              if (!dateRange.from || !dateRange.to || !campaign.startDate) return true;
              const campaignDate = new Date(campaign.startDate);
              return campaignDate >= dateRange.from && campaignDate <= dateRange.to;
            })}
          />

          {/* Performance Chart - Now full width */}
          <PerformanceChart 
            data={mockChartData}
            className="mb-8"
          />

          {/* Action Plan - Now full width */}
          <div className="mb-8">
            <ActionPlan actions={mockActions} />
          </div>

          {/* Analysis Summary */}
          <AnalysisSummaryV2 
            strengths={mockStrengths} 
            weaknesses={mockWeaknesses} 
          />

          {/* Campaign List */}
          <div className="mt-8">
            <CampaignListV2 campaigns={campaigns} />
          </div>
        </div>
      </main>
    </>
  );
}
