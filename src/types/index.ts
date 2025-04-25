export interface Campaign {
  id: string;
  name: string;
  platform: "google" | "meta";
  status: "active" | "paused";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpa: number;
  reach: number;
  startDate?: string;
  endDate?: string;
  campaignUrl?: string;
}

export interface ChartData {
  date: string;
  clicks: number;
  impressions: number;
  conversion_rate: number;
  cpc: number;
  cpm: number;
  cpa: number;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeEstimate: string;
  impact: string;
}

export interface RawCampaignData {
  dia: string;
  objetivo: string;
  plataforma: string;
  nome_campanha: string;
  nome_conjunto: string;
  nome_anuncio: string;
  orcamento_campanha: string;
  tipo_orcamento_campanha: string;
  orcamento_conjunto: string;
  tipo_orcamento_conjunto: string;
  valor_usado_brl: string;
  impressoes: string;
  alcance: string;
  tipo_resultado: string;
  resultados: string;
  status: string;
  nivel: string;
  cliques_link: string;
  data_inicial: string;
  data_final: string;
}

export interface GoogleSheetsCredentials {
  api_key: string;
  client_id: string;
  client_secret?: string;
  refresh_token?: string;
  access_token?: string;
}

export interface SheetConfig {
  spreadsheet_id: string;
  sheet_range: string;
}

export interface ResultsByType {
  [key: string]: {
    count: number;
    spent: number;
  };
}
