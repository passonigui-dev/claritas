
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
