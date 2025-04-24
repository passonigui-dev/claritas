import { Action, Campaign, ChartData } from "@/types";

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Campanha de Conversão - Produtos Premium",
    platform: "google",
    status: "active",
    budget: 5000,
    spent: 2750.45,
    impressions: 125000,
    clicks: 7800,
    conversions: 342,
    ctr: 6.24,
    cpc: 0.35,
    cpa: 8.04,
    reach: 95000
  },
  {
    id: "2",
    name: "Remarketing - Carrinhos Abandonados",
    platform: "meta",
    status: "active",
    budget: 3000,
    spent: 1850.30,
    impressions: 95000,
    clicks: 5200,
    conversions: 286,
    ctr: 5.47,
    cpc: 0.36,
    cpa: 6.47,
    reach: 72000
  },
  {
    id: "3",
    name: "Campanha de Marca - Awareness",
    platform: "google",
    status: "active",
    budget: 4500,
    spent: 3850.90,
    impressions: 250000,
    clicks: 9800,
    conversions: 187,
    ctr: 3.92,
    cpc: 0.39,
    cpa: 20.59,
    reach: 180000
  },
  {
    id: "4",
    name: "Campanha de Produto - Lançamento",
    platform: "meta",
    status: "paused",
    budget: 6000,
    spent: 5400.35,
    impressions: 180000,
    clicks: 10500,
    conversions: 420,
    ctr: 5.83,
    cpc: 0.51,
    cpa: 12.86,
    reach: 130000
  }
];

export const mockChartData: ChartData[] = [
  { date: "01/03", clicks: 450, impressions: 8000, conversion_rate: 4.2, cpc: 0.38, cpm: 23.75, cpa: 9.05 },
  { date: "02/03", clicks: 512, impressions: 9200, conversion_rate: 4.5, cpc: 0.37, cpm: 22.50, cpa: 8.22 },
  { date: "03/03", clicks: 578, impressions: 9800, conversion_rate: 4.8, cpc: 0.36, cpm: 21.80, cpa: 7.50 },
  { date: "04/03", clicks: 602, impressions: 10500, conversion_rate: 5.0, cpc: 0.35, cpm: 20.90, cpa: 7.00 },
  { date: "05/03", clicks: 489, impressions: 9700, conversion_rate: 4.7, cpc: 0.37, cpm: 22.00, cpa: 7.87 },
  { date: "06/03", clicks: 523, impressions: 9900, conversion_rate: 4.9, cpc: 0.36, cpm: 21.50, cpa: 7.35 },
  { date: "07/03", clicks: 587, impressions: 10800, conversion_rate: 5.2, cpc: 0.34, cpm: 20.40, cpa: 6.54 },
  { date: "08/03", clicks: 645, impressions: 11500, conversion_rate: 5.5, cpc: 0.33, cpm: 19.80, cpa: 6.00 },
  { date: "09/03", clicks: 598, impressions: 11000, conversion_rate: 5.3, cpc: 0.34, cpm: 20.00, cpa: 6.42 },
  { date: "10/03", clicks: 612, impressions: 11200, conversion_rate: 5.4, cpc: 0.33, cpm: 19.70, cpa: 6.11 },
  { date: "11/03", clicks: 654, impressions: 11700, conversion_rate: 5.6, cpc: 0.32, cpm: 19.40, cpa: 5.71 },
  { date: "12/03", clicks: 687, impressions: 12200, conversion_rate: 5.8, cpc: 0.31, cpm: 19.10, cpa: 5.34 },
  { date: "13/03", clicks: 695, impressions: 12400, conversion_rate: 5.9, cpc: 0.31, cpm: 18.90, cpa: 5.25 },
  { date: "14/03", clicks: 715, impressions: 12700, conversion_rate: 6.1, cpc: 0.30, cpm: 18.50, cpa: 4.92 }
];

export const mockStrengths = [
  {
    title: "Alta taxa de conversão no Google Ads",
    description: "Suas campanhas no Google possuem taxa de conversão superior a 5%, acima da média do setor (3,2%)."
  },
  {
    title: "Campanha de remarketing eficiente",
    description: "A campanha de Remarketing tem CPA 25% menor que a média das outras campanhas."
  },
  {
    title: "CTR crescente mês a mês",
    description: "Houve um crescimento constante do CTR nas últimas 4 semanas, indicando melhora na relevância dos anúncios."
  },
  {
    title: "Baixo custo por clique",
    description: "O CPC médio de R$0,35 está consideravelmente abaixo da referência do setor (R$0,58)."
  }
];

export const mockWeaknesses = [
  {
    title: "Alto CPA na campanha de marca",
    description: "O custo por aquisição da campanha de brand awareness está 60% acima das demais campanhas."
  },
  {
    title: "Baixa performance em dispositivos móveis",
    description: "A taxa de conversão em dispositivos móveis é 40% menor que em desktops."
  },
  {
    title: "Segmentação ampla demais",
    description: "As campanhas do Meta Ads têm audiência muito abrangente, desperdiçando budget em público não qualificado."
  },
  {
    title: "Orçamento mal distribuído",
    description: "85% do orçamento está concentrado em campanhas com desempenho inferior."
  }
];

export const mockActions: Action[] = [
  {
    id: "action1",
    title: "Otimizar segmentação de campanhas no Meta Ads",
    description: "Reduzir a amplitude da audiência e focar em públicos mais similares aos compradores atuais.",
    priority: "high",
    timeEstimate: "2-3 dias",
    impact: "Potencial redução de 25% no CPA"
  },
  {
    id: "action2",
    title: "Revisar estratégia de lances para dispositivos móveis",
    description: "Ajustar os lances para dispositivos móveis e melhorar as landing pages para experiência em mobile.",
    priority: "high",
    timeEstimate: "3-4 dias",
    impact: "Aumento potencial de 35% na taxa de conversão mobile"
  },
  {
    id: "action3",
    title: "Redistribuir orçamento com base no ROAS",
    description: "Migrar parte do orçamento das campanhas de brand awareness para as campanhas de conversão e remarketing.",
    priority: "medium",
    timeEstimate: "1 dia",
    impact: "Possível aumento de 15% no ROAS geral"
  },
  {
    id: "action4",
    title: "Melhorar qualidade dos textos dos anúncios",
    description: "Criar variações A/B com textos mais persuasivos e chamadas para ação mais claras.",
    priority: "medium",
    timeEstimate: "2-3 dias",
    impact: "Potencial aumento de 10-15% no CTR"
  },
  {
    id: "action5",
    title: "Implementar estratégia de keywords negativas",
    description: "Analisar relatório de termos de pesquisa e adicionar keywords negativas para evitar cliques irrelevantes.",
    priority: "low",
    timeEstimate: "1-2 dias",
    impact: "Redução estimada de 8% no desperdício de orçamento"
  }
];
