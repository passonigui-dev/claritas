import { Campaign, ResultsByType } from "@/types";

export const calculateMetrics = (campaigns: Campaign[]) => {
  // For debugging - log the incoming spent values
  console.log('Raw spent values for calculation:', campaigns.map(c => ({
    name: c.name,
    spent: c.spent,
    type: typeof c.spent
  })));

  // Ensure we handle null, empty, or non-numeric values as zero
  const totalSpent = campaigns.reduce((sum, campaign) => {
    const spent = typeof campaign.spent === 'number' ? campaign.spent : 0;
    console.log(`Campaign: ${campaign.name}, Spent: ${spent}`);
    return sum + spent;
  }, 0);
  
  console.log('Total spent calculated:', totalSpent.toFixed(2));
  console.log('Number of campaigns:', campaigns.length);
  console.log('Campaigns with non-zero spend:', 
    campaigns.filter(c => c.spent > 0).map(c => ({
      name: c.name, 
      spent: c.spent
    }))
  );

  const totalImpressions = campaigns.reduce((sum, campaign) => {
    const impressions = typeof campaign.impressions === 'number' ? campaign.impressions : 0;
    return sum + impressions;
  }, 0);
  
  const totalClicks = campaigns.reduce((sum, campaign) => {
    const clicks = typeof campaign.clicks === 'number' ? campaign.clicks : 0;
    return sum + clicks;
  }, 0);
  
  const totalReach = campaigns.reduce((sum, campaign) => {
    const reach = typeof campaign.reach === 'number' ? campaign.reach : 0;
    return sum + reach;
  }, 0);

  // Group results by type
  const resultsByType = campaigns.reduce((acc: ResultsByType, campaign) => {
    const resultType = campaign.tipo_resultado || 'Outros';
    if (!acc[resultType]) {
      acc[resultType] = {
        count: 0,
        spent: 0
      };
    }
    acc[resultType].count += (typeof campaign.conversions === 'number' ? campaign.conversions : 0);
    acc[resultType].spent += (typeof campaign.spent === 'number' ? campaign.spent : 0);
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

// Format as BRL currency with exactly 2 decimal places
// Format using PT-BR locale with dot as thousand separator and comma as decimal separator
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format metric with PT-BR thousand separator, no decimals
export const formatMetric = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
