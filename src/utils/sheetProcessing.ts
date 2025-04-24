
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

  // O problema estava aqui: a primeira linha não são os cabeçalhos, mas dados
  // Vamos verificar se o primeiro item é uma data (2025-04-23) e não um cabeçalho
  const firstRowIsData = rows[0][0] && (
    rows[0][0].toString().match(/^\d{4}-\d{2}-\d{2}$/) || 
    rows[0][0].toString().match(/^\d{2}\/\d{2}\/\d{4}$/)
  );
  
  // Se a primeira linha parece ser dados e não cabeçalhos,
  // vamos criar cabeçalhos padrão baseados na especificação fornecida
  const headers = firstRowIsData ? 
    ["dia", "objetivo", "plataforma", "nome_campanha", "nome_conjunto", 
     "nome_anuncio", "orcamento_campanha", "tipo_orcamento_campanha", 
     "orcamento_conjunto", "tipo_orcamento_conjunto", "valor_usado_brl", 
     "impressoes", "alcance", "tipo_resultado", "resultados", "status", 
     "nivel", "cliques_link", "data_inicial", "data_final"] :
    rows[0].map((header: any) => header ? header.toString().toLowerCase().trim() : "");
  
  console.log("Headers identificados:", headers);
  console.log("Primeira linha de dados:", rows[firstRowIsData ? 0 : 1]);
  
  // Verificamos se temos cabeçalhos válidos
  if (headers.filter(Boolean).length === 0) {
    console.error("No valid headers found in the data");
    throw new Error("Não foi possível identificar cabeçalhos válidos na planilha.");
  }

  // Determinamos a linha inicial para os dados
  const dataStartIndex = firstRowIsData ? 0 : 1;
  
  // Map data rows to objects using headers
  const processedData = rows.slice(dataStartIndex).map(row => {
    const rowData: Record<string, any> = {};
    headers.forEach((header: string, index: number) => {
      // Só processa se o cabeçalho existir e não estiver vazio
      if (header && index < row.length) {
        const value = row[index];
        // Converte valores numéricos
        if (['valor_usado_brl', 'orcamento_campanha', 'orcamento_conjunto', 
             'impressoes', 'alcance', 'resultados', 'cliques_link'].includes(header)) {
          rowData[header] = normalizeNumber(value);
        } else if (['data_inicial', 'data_final', 'dia'].includes(header)) {
          rowData[header] = normalizeDate(value !== undefined && value !== null ? value.toString() : '');
        } else {
          rowData[header] = value !== undefined && value !== null ? value.toString() : '';
        }
      }
    });
    return rowData as RawCampaignData;
  });

  console.log("Dados processados (primeiros 2):", processedData.slice(0, 2));

  // Transforma os dados processados em objetos Campaign
  return processedData
    .filter(row => row.nome_campanha && row.plataforma) // Garante que campos obrigatórios existam
    .map((row: RawCampaignData, index: number): Campaign => {
      // Gera um ID único usando múltiplos campos
      const campaignId = `${row.plataforma || 'unknown'}-${row.nome_campanha || 'unnamed'}-${index}`.toLowerCase().replace(/\s+/g, '-');
      
      // Determina o tipo de plataforma com fallback seguro
      const platformType = (row.plataforma || '').toLowerCase().includes("google") ? "google" : "meta";
      
      // Determina o status com fallback seguro
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
