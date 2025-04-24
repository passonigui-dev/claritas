
import { Campaign } from "@/types";

export interface RawSheetData {
  plataforma: string;
  "nome da campanha": string;
  "valor usado (brl)": number;
  impressoes: number;
  alcance: number;
  resultados: number;
  "cliques no link": number;
  status: string;
  "data inicial": string;
  "data final": string;
  "link da campanha": string;
}

export const processSheetData = (data: RawSheetData[]): Campaign[] => {
  return data.map(row => {
    const campaignId = `${row.plataforma}-${row["nome da campanha"]}`.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: campaignId,
      name: row["nome da campanha"],
      platform: row.plataforma.toLowerCase().includes("google") ? "google" : "meta",
      status: row.status.toLowerCase().includes("ativ") ? "active" : "paused",
      budget: 0, // Default value, could be added to sheet later
      spent: row["valor usado (brl)"],
      impressions: row.impressoes,
      clicks: row["cliques no link"],
      conversions: row.resultados,
      reach: row.alcance,
      ctr: (row["cliques no link"] / row.impressoes) * 100,
      cpc: row["valor usado (brl)"] / row["cliques no link"],
      cpa: row["valor usado (brl)"] / row.resultados,
      startDate: row["data inicial"],
      endDate: row["data final"],
      campaignUrl: row["link da campanha"]
    };
  });
};
