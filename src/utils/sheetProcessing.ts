
import { Campaign } from "@/types";

export interface RawSheetData {
  plataforma?: string;
  "nome da campanha"?: string;
  "valor usado (brl)"?: number;
  impressoes?: number;
  alcance?: number;
  resultados?: number;
  "cliques no link"?: number;
  status?: string;
  "data inicial"?: string;
  "data final"?: string;
  "link da campanha"?: string;
}

export const processSheetData = (rows: any[]): Campaign[] => {
  // Check if we have header row and data rows
  if (!rows || rows.length === 0) {
    console.log("No rows received from Google Sheets");
    return [];
  }

  // Check if the data is in array format (direct from Google Sheets API)
  // If so, convert to objects using header row
  let processedData = [];
  
  if (Array.isArray(rows[0])) {
    // Looks like we're getting raw arrays from the API
    // First row should be headers
    const headers = rows[0].map(header => header?.toString().toLowerCase() || "");
    console.log("Headers detected:", headers);
    
    // Map the rest of the rows to objects
    processedData = rows.slice(1).map(row => {
      const rowData: Record<string, any> = {};
      headers.forEach((header, index) => {
        if (header && row[index] !== undefined) {
          // Convert numeric values
          if (!isNaN(Number(row[index])) && row[index] !== '') {
            rowData[header] = Number(row[index]);
          } else {
            rowData[header] = row[index];
          }
        }
      });
      return rowData;
    });
  } else {
    // Data is already in object format
    processedData = rows;
  }

  console.log("Processed data sample:", processedData.length > 0 ? processedData[0] : "No data");
  
  // Now map the processed data to Campaign objects
  return processedData.map((row, index) => {
    // Get platform and campaign name safely
    const platform = row.plataforma || row["plataforma"] || "unknown";
    const campaignName = row["nome da campanha"] || row["nome_da_campanha"] || `Campaign ${index + 1}`;
    
    // Generate a unique ID
    const campaignId = `${platform}-${campaignName}`.toLowerCase().replace(/\s+/g, '-');
    
    // Extract values with fallbacks for each field
    const spent = parseFloat(row["valor usado (brl)"] || row["valor_usado_brl"] || 0);
    const impressions = parseInt(row.impressoes || row["impressões"] || 0);
    const clicks = parseInt(row["cliques no link"] || row["cliques_no_link"] || 0);
    const results = parseInt(row.resultados || 0);
    const reach = parseInt(row.alcance || 0);
    
    // Calculate metrics safely to avoid division by zero
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spent / clicks : 0;
    const cpa = results > 0 ? spent / results : 0;
    
    // Determine platform type from the value
    const platformType = platform.toLowerCase().includes("google") ? "google" : "meta";
    
    // Determine status
    const statusValue = (row.status || "").toString().toLowerCase();
    const status = statusValue.includes("ativ") ? "active" : "paused";

    return {
      id: campaignId,
      name: campaignName,
      platform: platformType,
      status: status,
      budget: 0, // Default value, could be added to sheet later
      spent: spent,
      impressions: impressions,
      clicks: clicks,
      conversions: results,
      reach: reach,
      ctr: ctr,
      cpc: cpc,
      cpa: cpa,
      startDate: row["data inicial"] || row["data_inicial"] || "",
      endDate: row["data final"] || row["data_final"] || "",
      campaignUrl: row["link da campanha"] || row["link_da_campanha"] || ""
    };
  });
};
