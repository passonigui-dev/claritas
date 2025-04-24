
import { Campaign } from "@/types";

export const processSheetData = (data: RawSheetData[]): Campaign[] => {
  const campaignMap = new Map<string, Campaign>();

  data.forEach(row => {
    const campaignId = `${row.plataforma}-${row["nome da campanha"]}`.toLowerCase();
    
    const existingCampaign = campaignMap.get(campaignId);
    if (existingCampaign) {
      // Aggregate metrics for existing campaign
      existingCampaign.spent += row["valor usado (brl)"];
      existingCampaign.impressions += row.impressoes;
      existingCampaign.clicks += row["cliques no link"];
      existingCampaign.conversions += row.resultados;
      existingCampaign.reach = Math.max(existingCampaign.reach, row.alcance);
    } else {
      // Create new campaign entry
      campaignMap.set(campaignId, {
        id: campaignId,
        name: row["nome da campanha"],
        platform: row.plataforma.toLowerCase().includes("google") ? "google" : "meta",
        status: row.status.toLowerCase().includes("ativ") ? "active" : "paused",
        budget: 0, // This will need to be set from campaign budget column
        spent: row["valor usado (brl)"],
        impressions: row.impressoes,
        clicks: row["cliques no link"],
        conversions: row.resultados,
        reach: row.alcance,
        ctr: (row["cliques no link"] / row.impressoes) * 100,
        cpc: row["valor usado (brl)"] / row["cliques no link"],
        cpa: row["valor usado (brl)"] / row.resultados
      });
    }
  });

  return Array.from(campaignMap.values());
};

// Add the RawSheetData interface back since it was likely removed
interface RawSheetData {
  dia: string;
  plataforma: string;
  "nome da campanha": string;
  "valor usado (brl)": number;
  impressoes: number;
  alcance: number;
  resultados: number;
  "cliques no link": number;
  status: string;
}
