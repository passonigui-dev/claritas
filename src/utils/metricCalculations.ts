
import { Campaign } from "@/types";

export const calculateMetrics = (campaigns: Campaign[]) => {
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);

  const cpm = totalImpressions > 0 
    ? (totalSpent / totalImpressions) * 1000 
    : 0;

  const cpc = totalClicks > 0 
    ? totalSpent / totalClicks 
    : 0;

  const cpa = totalConversions > 0 
    ? totalSpent / totalConversions 
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
  return `R$ ${value.toFixed(2)}`;
};

export const formatMetric = (value: number): string => {
  return value.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });
};

