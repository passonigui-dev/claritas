
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

// Enhanced normalization function for BRL currency values
const normalizeNumber = (value: any): number => {
  // Debug the input value and type
  console.log(`Normalizing input: "${value}" (type: ${typeof value})`);
  
  // Handle numbers directly
  if (typeof value === 'number') return value;
  
  // Handle string values (most common case)
  if (typeof value === 'string') {
    // Handle empty strings or whitespace-only strings
    if (!value.trim()) {
      console.log(`  Empty string detected, returning 0`);
      return 0;
    }
    
    // Store original value for debugging
    const originalValue = value;
    
    // First, clean the string from any non-numeric characters except comma and dot
    // Remove R$, spaces, and other non-numeric characters
    let cleaned = value.replace(/[R$\s]/g, '').trim();
    cleaned = cleaned.replace(/[^0-9,.-]/g, '');
    
    // Handle PT-BR currency format cases
    
    // Case 1: Only comma as decimal separator (e.g., "1234,56")
    if (cleaned.includes(',') && !cleaned.includes('.')) {
      cleaned = cleaned.replace(',', '.');
      console.log(`  Case 1 - Only comma: "${originalValue}" -> "${cleaned}"`);
    } 
    // Case 2: Both dots and comma (e.g., "1.234,56" -> "1234.56")
    else if (cleaned.includes(',') && cleaned.includes('.')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      console.log(`  Case 2 - Dots and comma: "${originalValue}" -> "${cleaned}"`);
    }
    // Case 3: Only dots, could be thousands or decimal (context dependent)
    else if (!cleaned.includes(',') && cleaned.includes('.')) {
      // In Brazil, decimal separator is comma, so when only dots are present, 
      // we need to determine if it's a decimal or thousands separator
      // Most likely in this case it's a decimal point already
      console.log(`  Case 3 - Only dots: "${originalValue}" -> "${cleaned}"`);
    }
    
    // Use parseFloat for the actual conversion
    const parsed = parseFloat(cleaned);
    
    // Ensure we have a valid number, otherwise return 0
    if (isNaN(parsed)) {
      console.log(`  Parsing failed for "${originalValue}", returning 0`);
      return 0;
    }
    
    // Round to 2 decimal places to avoid floating point issues
    const rounded = Math.round(parsed * 100) / 100;
    console.log(`  Normalized: "${originalValue}" -> "${cleaned}" -> ${parsed} -> ${rounded}`);
    
    return rounded;
  }
  
  // Handle any other types (null, undefined, objects, etc)
  console.log(`  Unsupported type: ${typeof value}, returning 0`);
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

  // Log the raw values for valor_usado_brl to debug
  console.log("Raw spent values:", rawData.map(r => r.valor_usado_brl));
  
  // Calculate total spent for debugging - parsing directly from the original value
  let totalCentsRawSpent = 0;
  const rowBreakdown: { raw: any, normalized: number, cents: number }[] = [];
  
  rows.slice(dataStartIndex).forEach((row, idx) => {
    const spentIndex = headers.indexOf('valor_usado_brl');
    if (spentIndex >= 0 && spentIndex < row.length) {
      const rawValue = row[spentIndex];
      const normalizedValue = normalizeNumber(rawValue);
      
      // Convert to cents to avoid floating point issues when summing
      const cents = Math.round(normalizedValue * 100);
      totalCentsRawSpent += cents;
      
      // Store for detailed breakdown
      rowBreakdown.push({ raw: rawValue, normalized: normalizedValue, cents });
      
      console.log(`Row ${idx+dataStartIndex}: Raw value: "${rawValue}", Normalized: ${normalizedValue}, Cents: ${cents}`);
    } else {
      console.log(`Row ${idx+dataStartIndex}: No valor_usado_brl found at index ${spentIndex}`);
    }
  });
  
  const totalRawSpentFromCents = totalCentsRawSpent / 100;
  console.log("Total raw spent calculated directly from sheet (in cents):", totalCentsRawSpent, "= R$", totalRawSpentFromCents.toFixed(2));
  console.log("Detailed breakdown of all rows:", rowBreakdown);

  // Transform raw data into Campaign objects for the dashboard
  const campaigns = rawData
    .filter(row => row.nome_campanha && row.plataforma)
    .map((row: RawCampaignData, index: number): Campaign => {
      const campaignId = `${row.plataforma || 'unknown'}-${row.nome_campanha || 'unnamed'}-${index}`.toLowerCase().replace(/\s+/g, '-');
      const platformType = (row.plataforma || '').toLowerCase().includes("google") ? "google" : "meta";
      const status = (row.status || '').toLowerCase().includes("ativ") ? "active" : "paused";

      // Raw value directly from spreadsheet for debugging
      const originalValue = rows[index + dataStartIndex][headers.indexOf('valor_usado_brl')];
      
      // Parse directly from original value to ensure accuracy
      const spentValue = normalizeNumber(originalValue);
      console.log(`Campaign ${row.nome_campanha} - Raw spent: "${originalValue}", Parsed: ${spentValue}`);

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

  // Calculate total spent using cents to avoid floating point issues
  let totalCents = 0;
  campaigns.forEach(c => {
    const campaignCents = Math.round(c.spent * 100);
    totalCents += campaignCents;
    console.log(`Campaign ${c.name}: ${c.spent} (${campaignCents} cents)`);
  });
  const totalSpent = totalCents / 100;
  
  console.log(`Total spent across all campaigns (in cents): ${totalCents} = R$ ${totalSpent.toFixed(2)}`);
  console.log(`Expected total: R$ 16.006,05`);
  console.log(`Difference: R$ ${(16006.05 - totalSpent).toFixed(2)}`);
  console.log(`Number of campaigns with spent: ${campaigns.filter(c => c.spent > 0).length}`);
  console.log(`Campaign spent values: ${campaigns.filter(c => c.spent > 0).map(c => c.spent).join(', ')}`);

  return { campaigns, rawData };
};
