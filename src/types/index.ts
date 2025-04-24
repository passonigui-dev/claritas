
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
