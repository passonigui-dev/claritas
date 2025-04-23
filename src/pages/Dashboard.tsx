
import { Navbar } from "@/components/Navbar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { CampaignList } from "@/components/dashboard/CampaignList";
import { ActionPlan } from "@/components/dashboard/ActionPlan";
import { AnalysisSummary } from "@/components/dashboard/AnalysisSummary";
import { 
  LineChart, 
  DollarSign, 
  MousePointer, 
  BarChart 
} from "lucide-react";
import { mockCampaigns, mockChartData, mockStrengths, mockWeaknesses, mockActions } from "@/data/mockData";

export default function Dashboard() {
  // Na implementação real, estes dados viriam da análise da IA
  const totalSpent = mockCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalClicks = mockCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalConversions = mockCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const avgCtr = mockCampaigns.reduce((sum, campaign) => sum + campaign.ctr, 0) / mockCampaigns.length;
  
  return (
    <>
      <Navbar />
      
      <main className="py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Análise de {mockCampaigns.length} campanhas • Última atualização: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* KPIs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
              title="Total Investido"
              value={`R$ ${totalSpent.toFixed(2)}`}
              description="Soma do investimento em todas as campanhas"
              icon={DollarSign}
              trend="up"
              trendValue="12% vs. período anterior"
            />
            <KpiCard
              title="Cliques Totais"
              value={totalClicks.toLocaleString()}
              description="Total de cliques em todas as campanhas"
              icon={MousePointer}
              trend="up"
              trendValue="8% vs. período anterior"
            />
            <KpiCard
              title="Conversões"
              value={totalConversions.toLocaleString()}
              description="Total de conversões atribuídas"
              icon={BarChart}
              trend="up"
              trendValue="15% vs. período anterior"
            />
            <KpiCard
              title="CTR Médio"
              value={`${avgCtr.toFixed(2)}%`}
              description="Taxa média de clique em todas as campanhas"
              icon={LineChart}
              trend="up"
              trendValue="5% vs. período anterior"
            />
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
            <CampaignList campaigns={mockCampaigns} />
          </div>
        </div>
      </main>
    </>
  );
}
