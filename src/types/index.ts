
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

// Supabase types for Google Sheets integration
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
