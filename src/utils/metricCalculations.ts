
import { Campaign } from "@/types";

export const calculateMetrics = (campaigns: Campaign[]) => {
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);

  const cpm = totalImpressions > 0 
    ? Math.floor((totalSpent / totalImpressions) * 1000)
    : 0;

  const cpc = totalClicks > 0 
    ? Math.floor(totalSpent / totalClicks)
    : 0;

  const cpa = totalConversions > 0 
    ? Math.floor(totalSpent / totalConversions)
    : 0;

  return {
    totalSpent,
    totalImpressions,
    totalClicks,
    totalConversions,
    totalReach,
    cpm,
    cpc,
    cpa
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatMetric = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
