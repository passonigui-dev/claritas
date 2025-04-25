
import { Campaign, RawCampaignData } from "@/types";

// Format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (value: any): string => {
  if (!value) return '--/--/----';
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '--/--/----';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return '--/--/----';
  }
};

// Format number with thousand separator (PT-BR)
const formatNumber = (value: any): string => {
  const numberValue = normalizeNumber(value);
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numberValue);
};

// Improved normalization function for BRL currency values
const normalizeNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove currency symbols, spaces and replace comma with dot for decimal separator
    const cleaned = value.replace(/[^0-9,.-]/g, '')
                         .replace(/\./g, '')  // Remove dots (thousand separators)
                         .replace(',', '.'); // Replace comma with dot for decimal
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const normalizeText = (value: any): string => {
  return value !== undefined && value !== null ? String(value).trim() : '';
};

export const processSheetData = (rows: any[]): { campaigns: Campaign[], rawData: RawCampaignData[] } => {
  if (!rows || rows.length < 2) {
    console.log("No valid data rows received from Google Sheets");
    return { campaigns: [], rawData: [] };
  }

  // Check if first row is data
  const firstRowIsData = rows[0][0] && (
    rows[0][0].toString().match(/^\d{4}-\d{2}-\d{2}$/) || 
    rows[0][0].toString().match(/^\d{2}\/\d{2}\/\d{4}$/)
  );
  
  const headers = firstRowIsData ? 
    ["dia", "objetivo", "plataforma", "nome_campanha", "nome_conjunto", 
     "nome_anuncio", "orcamento_campanha", "tipo_orcamento_campanha", 
     "orcamento_conjunto", "tipo_orcamento_conjunto", "valor_usado_brl", 
     "impressoes", "alcance", "tipo_resultado", "resultados", "status", 
     "nivel", "cliques_link", "data_inicial", "data_final"] :
    rows[0].map((header: any) => header ? header.toString().toLowerCase().trim() : "");
  
  console.log("Headers identified:", headers);
  
  if (headers.filter(Boolean).length === 0) {
    console.error("No valid headers found in the data");
    throw new Error("Não foi possível identificar cabeçalhos válidos na planilha.");
  }

  const dataStartIndex = firstRowIsData ? 0 : 1;
  
  // Process raw data with proper formatting
  const rawData = rows.slice(dataStartIndex).map((row: any[]) => {
    const rawRow: Record<string, any> = {};
    headers.forEach((header: string, index: number) => {
      if (header && index < row.length) {
        const value = row[index];
        
        // Format values based on field type
        if (['dia', 'data_inicial', 'data_final'].includes(header)) {
          rawRow[header] = formatDate(value);
        } else if (['orcamento_campanha', 'orcamento_conjunto', 'valor_usado_brl', 'impressoes', 'alcance', 'resultados', 'cliques_link'].includes(header)) {
          rawRow[header] = formatNumber(value);
        } else {
          rawRow[header] = normalizeText(value);
        }
      }
    });
    return rawRow as RawCampaignData;
  });

  console.log("Raw data processed (first row):", rawData[0]);

  // Log the data to debug
  console.log("Raw spent values:", rawData.map(r => r.valor_usado_brl));

  // Transform raw data into Campaign objects for the dashboard
  const campaigns = rawData
    .filter(row => row.nome_campanha && row.plataforma)
    .map((row: RawCampaignData, index: number): Campaign => {
      const campaignId = `${row.plataforma || 'unknown'}-${row.nome_campanha || 'unnamed'}-${index}`.toLowerCase().replace(/\s+/g, '-');
      const platformType = (row.plataforma || '').toLowerCase().includes("google") ? "google" : "meta";
      const status = (row.status || '').toLowerCase().includes("ativ") ? "active" : "paused";

      // Properly handle monetary values, ensuring we parse them correctly
      const spentValue = normalizeNumber(row.valor_usado_brl);
      console.log(`Campaign ${row.nome_campanha} - Raw spent: ${row.valor_usado_brl}, Parsed: ${spentValue}`);

      return {
        id: campaignId,
        name: row.nome_campanha || 'Unnamed Campaign',
        platform: platformType,
        status: status,
        budget: normalizeNumber(row.orcamento_campanha),
        spent: spentValue,
        impressions: normalizeNumber(row.impressoes),
        clicks: normalizeNumber(row.cliques_link),
        conversions: normalizeNumber(row.resultados),
        reach: normalizeNumber(row.alcance),
        ctr: normalizeNumber(row.impressoes) > 0 ? 
          (normalizeNumber(row.cliques_link) / normalizeNumber(row.impressoes)) * 100 : 0,
        cpc: normalizeNumber(row.cliques_link) > 0 ? 
          spentValue / normalizeNumber(row.cliques_link) : 0,
        cpa: normalizeNumber(row.resultados) > 0 ? 
          spentValue / normalizeNumber(row.resultados) : 0,
        startDate: row.data_inicial || '',
        endDate: row.data_final || '',
        tipo_resultado: row.tipo_resultado || 'Outros'
      };
    });

  // Log total spent to help debug
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  console.log(`Total spent across all campaigns: ${totalSpent}`);

  return { campaigns, rawData };
};
