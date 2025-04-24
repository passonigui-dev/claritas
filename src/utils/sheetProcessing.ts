
import { Campaign, RawCampaignData } from "@/types";

const normalizeNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove currency symbols and convert to number
    const cleaned = value.replace(/[^0-9.-]+/g, '');
    return Number(cleaned) || 0;
  }
  return 0;
};

const normalizeDate = (date: string): string => {
  if (!date) return '';
  try {
    // Attempt to parse and format the date
    const parsed = new Date(date);
    return parsed.toISOString().split('T')[0];
  } catch {
    return date;
  }
};

export const processSheetData = (rows: any[]): Campaign[] => {
  if (!rows || rows.length < 2) {
    console.log("No valid data rows received from Google Sheets");
    return [];
  }

  // Get headers from first row and normalize them
  const headers = rows[0].map((header: string) => 
    header?.toString().toLowerCase().trim() || ""
  );
  
  console.log("Processing with headers:", headers);

  // Map data rows to objects using headers
  const processedData = rows.slice(1).map(row => {
    const rowData: Record<string, any> = {};
    headers.forEach((header: string, index: number) => {
      if (header && row[index] !== undefined) {
        const value = row[index];
        // Convert numeric values
        if (['valor_usado_brl', 'orcamento_campanha', 'orcamento_conjunto', 
             'impressoes', 'alcance', 'resultados', 'cliques_link'].includes(header)) {
          rowData[header] = normalizeNumber(value);
        } else if (['data_inicial', 'data_final', 'dia'].includes(header)) {
          rowData[header] = normalizeDate(value);
        } else {
          rowData[header] = value?.toString() || '';
        }
      }
    });
    return rowData as RawCampaignData;
  });

  // Transform the processed data into Campaign objects
  return processedData.map((row: RawCampaignData, index: number): Campaign => {
    // Generate a unique ID using multiple fields
    const campaignId = `${row.plataforma}-${row.nome_campanha}-${index}`.toLowerCase().replace(/\s+/g, '-');
    
    // Determine platform type
    const platformType = row.plataforma.toLowerCase().includes("google") ? "google" : "meta";
    
    // Determine status
    const normalizedStatus = row.status.toLowerCase();
    const status = normalizedStatus.includes("ativ") ? "active" : "paused";

    return {
      id: campaignId,
      name: row.nome_campanha,
      platform: platformType,
      status: status,
      budget: row.orcamento_campanha,
      spent: row.valor_usado_brl,
      impressions: row.impressoes,
      clicks: row.cliques_link,
      conversions: row.resultados,
      reach: row.alcance,
      ctr: row.impressoes > 0 ? (row.cliques_link / row.impressoes) * 100 : 0,
      cpc: row.cliques_link > 0 ? row.valor_usado_brl / row.cliques_link : 0,
      cpa: row.resultados > 0 ? row.valor_usado_brl / row.resultados : 0,
      startDate: row.data_inicial,
      endDate: row.data_final
    };
  });
};
