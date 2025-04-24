
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

  // Use first row as headers but make them safer with null checks
  const headers = rows[0].map((header: any) => {
    // Ensure header is a string before calling toLowerCase
    return header ? header.toString().toLowerCase().trim() : "";
  });
  
  console.log("Processing with headers:", headers);

  // Check if we have valid headers
  if (headers.filter(Boolean).length === 0) {
    console.error("No valid headers found in the first row");
    return [];
  }

  // Map data rows to objects using headers
  const processedData = rows.slice(1).map(row => {
    const rowData: Record<string, any> = {};
    headers.forEach((header: string, index: number) => {
      // Only process if header exists and is not empty
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
  return processedData
    .filter(row => row.nome_campanha && row.plataforma) // Ensure required fields exist
    .map((row: RawCampaignData, index: number): Campaign => {
      // Generate a unique ID using multiple fields
      const campaignId = `${row.plataforma || 'unknown'}-${row.nome_campanha || 'unnamed'}-${index}`.toLowerCase().replace(/\s+/g, '-');
      
      // Determine platform type with safe fallback
      const platformType = (row.plataforma || '').toLowerCase().includes("google") ? "google" : "meta";
      
      // Determine status with safe fallback
      const normalizedStatus = (row.status || '').toLowerCase();
      const status = normalizedStatus.includes("ativ") ? "active" : "paused";

      return {
        id: campaignId,
        name: row.nome_campanha || 'Unnamed Campaign',
        platform: platformType,
        status: status,
        budget: row.orcamento_campanha || 0,
        spent: row.valor_usado_brl || 0,
        impressions: row.impressoes || 0,
        clicks: row.cliques_link || 0,
        conversions: row.resultados || 0,
        reach: row.alcance || 0,
        ctr: row.impressoes > 0 ? (row.cliques_link / row.impressoes) * 100 : 0,
        cpc: row.cliques_link > 0 ? row.valor_usado_brl / row.cliques_link : 0,
        cpa: row.resultados > 0 ? row.valor_usado_brl / row.resultados : 0,
        startDate: row.data_inicial || '',
        endDate: row.data_final || ''
      };
    });
};
