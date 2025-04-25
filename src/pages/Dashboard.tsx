import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { CampaignList } from "@/components/dashboard/CampaignList";
import { ActionPlan } from "@/components/dashboard/ActionPlan";
import { AnalysisSummary } from "@/components/dashboard/AnalysisSummary";
import { ResultsSection } from "@/components/dashboard/ResultsSection";
import { GoogleSheetsConnect } from "@/components/dashboard/GoogleSheetsConnect";
import { 
  DollarSign, 
  MousePointer,
  BarChart,
  Users
} from "lucide-react";
import { mockChartData, mockStrengths, mockWeaknesses, mockActions, mockCampaigns } from "@/data/mockData";
import { calculateMetrics, formatCurrency, formatMetric } from "@/utils/metricCalculations";
import { Campaign } from "@/types";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { processSheetData } from "@/utils/sheetProcessing";

export default function Dashboard() {
  const { campaigns: googleSheetsCampaigns, isLoading, useMockData } = useGoogleSheets();
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('campaignData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setLocalCampaigns(parsedData.campaigns || []);
        console.log('Loaded campaigns from localStorage:', parsedData.campaigns);
      } catch (error) {
        console.error("Error processing stored campaign data:", error);
      }
    }
  }, []);

  // Determine which campaigns data to use
  const campaigns = googleSheetsCampaigns && googleSheetsCampaigns.length > 0 
    ? googleSheetsCampaigns 
    : localCampaigns.length > 0 
      ? localCampaigns 
      : mockCampaigns;

  console.log('Current data source:', {
    hasGoogleSheets: Boolean(googleSheetsCampaigns?.length),
    hasLocalStorage: Boolean(localCampaigns.length),
    usingMockData: campaigns === mockCampaigns,
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
  } = calculateMetrics(campaigns);

  return (
    <>
      <Navbar />
      <main className="py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Análise de {campaigns.length} campanhas • 
                {isLoading ? 
                  " Atualizando dados..." : 
                  ` Última atualização: ${new Date().toLocaleDateString('pt-BR')}`
                }
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <GoogleSheetsConnect />
            </div>
          </div>

          {/* KPIs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
              title="Total Investido"
              value={formatCurrency(totalSpent)}
              description="Total investment across all campaigns"
              icon={DollarSign}
              trend="neutral"
              trendValue="Current period"
            />
            <KpiCard
              title="CPM"
              value={formatCurrency(cpm)}
              description="Cost per thousand impressions"
              icon={Users}
              trend="neutral"
              trendValue="Overall average"
            />
            <KpiCard
              title="CPC"
              value={formatCurrency(cpc)}
              description="Average cost per click"
              icon={MousePointer}
              trend="neutral"
              trendValue="Overall average"
            />
            <KpiCard
              title="Total Reach"
              value={formatMetric(totalReach)}
              description="Unique users reached"
              icon={BarChart}
              trend="neutral"
              trendValue="Overall total"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <KpiCard
              title="Total Reach"
              value={formatMetric(totalReach)}
              description="Unique users reached"
              icon={Users}
              className="md:col-span-1"
            />
            <KpiCard
              title="Impressions"
              value={formatMetric(totalImpressions)}
              description="Total ad impressions"
              icon={Users}
              className="md:col-span-1"
            />
            <KpiCard
              title="Clicks"
              value={formatMetric(totalClicks)}
              description="Total link clicks"
              icon={MousePointer}
              className="md:col-span-1"
            />
          </div>

          {/* Results Section */}
          <div className="mb-8">
            <ResultsSection resultsByType={resultsByType} cpaByType={cpaByType} />
          </div>

          {/* Performance Chart */}
          <div className="grid gap-8 md:grid-cols-3 mb-8">
            <PerformanceChart 
              data={mockChartData}
              className="col-span-full md:col-span-2"
            />

            {/* Campaign List */}
            <div className="col-span-full md:col-span-1">
              <ActionPlan actions={mockActions} />
            </div>
          </div>

          {/* Analysis Summary */}
          <AnalysisSummary 
            strengths={mockStrengths} 
            weaknesses={mockWeaknesses} 
          />

          {/* Campaign List */}
          <div className="mt-8">
            <CampaignList campaigns={campaigns} />
          </div>
        </div>
      </main>
    </>
  );
}
