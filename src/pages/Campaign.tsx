
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  LineChart, 
  DollarSign, 
  BarChart, 
  MousePointer, 
  Info 
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { ActionPlan } from "@/components/dashboard/ActionPlan";
import { AnalysisSummary } from "@/components/dashboard/AnalysisSummary";
import { mockCampaigns, mockChartData, mockStrengths, mockWeaknesses, mockActions } from "@/data/mockData";
import { Campaign as CampaignType } from "@/types";

export default function Campaign() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  
  useEffect(() => {
    // Em uma implementação real, aqui estaria a chamada para a API
    const found = mockCampaigns.find(c => c.id === id);
    setCampaign(found || null);
  }, [id]);
  
  if (!campaign) {
    return (
      <>
        <Navbar />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Campanha não encontrada</h1>
          <Link to="/dashboard">
            <Button>Voltar para o Dashboard</Button>
          </Link>
        </div>
      </>
    );
  }
  
  const conversionRate = (campaign.conversions / campaign.clicks * 100).toFixed(2);
  const roi = (((campaign.conversions * 50) - campaign.spent) / campaign.spent * 100).toFixed(2);
  
  return (
    <>
      <Navbar />
      
      <main className="py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <div className="mb-4">
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Voltar para o Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
              <div className="flex gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100">
                  {campaign.platform === "google" ? "Google Ads" : "Meta Ads"}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                  campaign.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {campaign.status === "active" ? "Ativo" : "Pausado"}
                </span>
              </div>
            </div>
          </div>

          {/* KPIs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard
              title="Investimento"
              value={`R$ ${campaign.spent.toFixed(2)}`}
              description={`de R$ ${campaign.budget.toFixed(2)} orçados`}
              icon={DollarSign}
              trend="neutral"
              trendValue={`${(campaign.spent / campaign.budget * 100).toFixed(0)}% utilizado`}
            />
            <KpiCard
              title="Cliques"
              value={campaign.clicks.toLocaleString()}
              description={`CTR: ${campaign.ctr}%`}
              icon={MousePointer}
              trend="up"
              trendValue="15% vs. média"
            />
            <KpiCard
              title="Conversões"
              value={campaign.conversions.toLocaleString()}
              description={`Taxa de conversão: ${conversionRate}%`}
              icon={BarChart}
              trend="up"
              trendValue="23% vs. média"
            />
            <KpiCard
              title="ROI"
              value={`${roi}%`}
              description={`CPA: R$ ${campaign.cpa.toFixed(2)}`}
              icon={LineChart}
              trend="up"
              trendValue="18% vs. média"
            />
          </div>

          <Tabs defaultValue="analysis" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="analysis">Análise</TabsTrigger>
              <TabsTrigger value="actions">Plano de Ação</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="space-y-8">
              <PerformanceChart data={mockChartData} />
              
              <AnalysisSummary 
                strengths={mockStrengths} 
                weaknesses={mockWeaknesses} 
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Análise detalhada da campanha
                  </CardTitle>
                  <CardDescription>
                    Avaliação detalhada realizada por nossa IA com base nos dados fornecidos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Segmentação de público</h3>
                    <p className="text-muted-foreground">
                      A campanha {campaign.name} apresenta segmentação adequada, porém com oportunidades de refinamento. 
                      Analisando os dados demográficos, observamos que o público na faixa etária 25-34 apresenta conversões 
                      40% superiores, sugerindo uma concentração maior de orçamento neste segmento.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Desempenho de anúncios</h3>
                    <p className="text-muted-foreground">
                      Os anúncios desta campanha possuem CTR superior à média do setor (6.24% vs 4.2%), indicando 
                      alta relevância. No entanto, a taxa de conversão após o clique pode ser melhorada com otimizações 
                      nas landing pages, que atualmente possuem tempo de carregamento 25% acima do recomendado.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Distribuição de orçamento</h3>
                    <p className="text-muted-foreground">
                      A campanhas tem orçamento diário bem distribuído, mas há oportunidade em ajustar a programação de horários. 
                      Observamos que os horários entre 19h e 21h geram 35% mais conversões com CPA 22% menor, sugerindo 
                      um ajuste de lances para priorizar estes horários.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Palavras-chave e criativo</h3>
                    <p className="text-muted-foreground">
                      As palavras-chave de cauda longa estão performando melhor que termos genéricos. A análise de termos 
                      de pesquisa revela oportunidades para adicionar 18 novas keywords com alto potencial baseado nos 
                      padrões de busca dos usuários que converteram.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="actions">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="col-span-full md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ações recomendadas para esta campanha</CardTitle>
                      <CardDescription>
                        Priorize estas ações para melhorar o desempenho da campanha {campaign.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="font-semibold mb-1">1. Refinar segmentação por idade</h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Aumente o lance para a faixa etária 25-34 em 20% e reduza para 55+ em 15%, 
                          baseado na análise de conversões por segmento.
                        </p>
                        <div className="flex gap-2 items-center mt-2">
                          <div className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                            Alta prioridade
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Tempo estimado: 30 minutos
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="font-semibold mb-1">2. Otimizar programação por horário</h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Configure ajustes de lance para aumentar em 25% durante o período de 19h-21h, 
                          quando o CPA é significativamente menor.
                        </p>
                        <div className="flex gap-2 items-center mt-2">
                          <div className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                            Alta prioridade
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Tempo estimado: 20 minutos
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="font-semibold mb-1">3. Adicionar palavras-chave de cauda longa</h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Adicione as 18 palavras-chave identificadas pela análise de termos de pesquisa 
                          que têm alto potencial de conversão.
                        </p>
                        <div className="flex gap-2 items-center mt-2">
                          <div className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                            Média prioridade
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Tempo estimado: 1 hora
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="font-semibold mb-1">4. Melhorar velocidade das landing pages</h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Otimize o tempo de carregamento das landing pages, atualmente 25% acima do recomendado, 
                          para melhorar a taxa de conversão pós-clique.
                        </p>
                        <div className="flex gap-2 items-center mt-2">
                          <div className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                            Baixa prioridade
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Tempo estimado: 3 horas
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="col-span-full md:col-span-1">
                  <ActionPlan actions={mockActions.slice(0, 3)} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
