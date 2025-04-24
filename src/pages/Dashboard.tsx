import { Navbar } from "@/components/Navbar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { CampaignList } from "@/components/dashboard/CampaignList";
import { ActionPlan } from "@/components/dashboard/ActionPlan";
import { AnalysisSummary } from "@/components/dashboard/AnalysisSummary";
import { 
  DollarSign, 
  MousePointer,
  BarChart,
  Users
} from "lucide-react";
import { mockCampaigns, mockChartData, mockStrengths, mockWeaknesses, mockActions } from "@/data/mockData";
import { calculateMetrics, formatCurrency, formatMetric } from "@/utils/metricCalculations";

export default function Dashboard() {
  const {
    totalSpent,
    totalImpressions,
    totalClicks,
    totalConversions,
    totalReach,
    cpm,
    cpc,
    cpa
  } = calculateMetrics(mockCampaigns);
  
  return (
    <>
      <Navbar />
      
      <main className="py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Análise de {mockCampaigns.length} campanhas • Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* KPIs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
              title="Total Investido"
              value={formatCurrency(totalSpent)}
              description="Soma do investimento em todas as campanhas"
              icon={DollarSign}
              trend="neutral"
              trendValue="Período atual"
            />
            <KpiCard
              title="CPM"
              value={formatCurrency(cpm)}
              description="Custo por mil impressões"
              icon={Users}
              trend="neutral"
              trendValue="Média geral"
            />
            <KpiCard
              title="CPC"
              value={formatCurrency(cpc)}
              description="Custo médio por clique"
              icon={MousePointer}
              trend="neutral"
              trendValue="Média geral"
            />
            <KpiCard
              title="CPA"
              value={formatCurrency(cpa)}
              description="Custo por aquisição médio"
              icon={BarChart}
              trend="neutral"
              trendValue="Média geral"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <KpiCard
              title="Alcance Total"
              value={formatMetric(totalReach)}
              description="Usuários únicos alcançados"
              icon={Users}
              className="md:col-span-1"
            />
            <KpiCard
              title="Impressões"
              value={formatMetric(totalImpressions)}
              description="Total de vezes que os anúncios foram exibidos"
              icon={Users}
              className="md:col-span-1"
            />
            <KpiCard
              title="Cliques"
              value={formatMetric(totalClicks)}
              description="Total de cliques em links"
              icon={MousePointer}
              className="md:col-span-1"
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
