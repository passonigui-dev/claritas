
import { Campaign, ResultsByType } from "@/types";

export const calculateMetrics = (campaigns: Campaign[]) => {
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);

  // Group results by type
  const resultsByType = campaigns.reduce((acc: ResultsByType, campaign) => {
    const resultType = campaign.tipo_resultado || 'Outros';
    if (!acc[resultType]) {
      acc[resultType] = {
        count: 0,
        spent: 0
      };
    }
    acc[resultType].count += campaign.conversions;
    acc[resultType].spent += campaign.spent;
    return acc;
  }, {});

  // Calculate CPAs by result type
  const cpaByType = Object.entries(resultsByType).reduce((acc: Record<string, number>, [type, data]) => {
    acc[type] = data.count > 0 ? data.spent / data.count : 0;
    return acc;
  }, {});

  const cpm = totalImpressions > 0 
    ? (totalSpent / totalImpressions) * 1000
    : 0;

  const cpc = totalClicks > 0 
    ? totalSpent / totalClicks
    : 0;

  return {
    totalSpent,
    totalImpressions,
    totalClicks,
    totalReach,
    cpm,
    cpc,
    resultsByType,
    cpaByType
  };
};

// Format as BRL currency with 2 decimal places
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format metric with PT-BR thousand separator
export const formatMetric = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
