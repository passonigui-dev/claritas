
import { Campaign, ResultsByType } from "@/types";

export const calculateMetrics = (campaigns: Campaign[], dateFrom?: Date, dateTo?: Date) => {
  // Filter campaigns by date range using 'dia' field
  const filteredCampaigns = campaigns.filter(campaign => {
    if (!dateFrom || !dateTo || !campaign.startDate) return true;
    
    // Parse dia from DD/MM/YYYY to Date object
    const [day, month, year] = campaign.startDate.split('/').map(Number);
    if (!day || !month || !year) return false;
    
    const campaignDate = new Date(year, month - 1, day); // month is 0-based
    return campaignDate >= dateFrom && campaignDate <= dateTo;
  });

  // Debug logs for date filtering
  console.log('Date filter:', { dateFrom, dateTo });
  console.log('Total campaigns before filter:', campaigns.length);
  console.log('Total campaigns after filter:', filteredCampaigns.length);
  console.log('Filtered campaigns date range:', filteredCampaigns.map(c => ({
    name: c.name,
    date: c.startDate
  })));

  // Calculate total spent using cents to avoid floating point issues
  let totalCents = 0;
  filteredCampaigns.forEach((campaign, index) => {
    const spent = typeof campaign.spent === 'number' ? campaign.spent : 0;
    const spentCents = Math.round(spent * 100);
    totalCents += spentCents;
    console.log(`Campaign ${index}: ${campaign.name}, Spent: ${spent} (${spentCents} cents), Running total: ${totalCents / 100}`);
  });
  
  const totalSpent = totalCents / 100;
  
  console.log('Total spent calculated (in cents):', totalCents, '=', totalSpent.toFixed(2));
  console.log('Number of campaigns:', campaigns.length);
  console.log('Campaigns with non-zero spend:', 
    campaigns.filter(c => c.spent > 0).map(c => ({
      name: c.name, 
      spent: c.spent
    }))
  );

  const totalImpressions = filteredCampaigns.reduce((sum, campaign) => {
    const impressions = typeof campaign.impressions === 'number' ? campaign.impressions : 0;
    return sum + impressions;
  }, 0);
  
  const totalClicks = filteredCampaigns.reduce((sum, campaign) => {
    const clicks = typeof campaign.clicks === 'number' ? campaign.clicks : 0;
    return sum + clicks;
  }, 0);
  
  const totalReach = filteredCampaigns.reduce((sum, campaign) => {
    const reach = typeof campaign.reach === 'number' ? campaign.reach : 0;
    return sum + reach;
  }, 0);

  // Group results by type with date filtering
  const resultsByType = filteredCampaigns.reduce((acc: ResultsByType, campaign) => {
    const resultType = campaign.tipo_resultado || 'Outros';
    if (!acc[resultType]) {
      acc[resultType] = {
        count: 0,
        spent: 0
      };
    }
    acc[resultType].count += (typeof campaign.conversions === 'number' ? campaign.conversions : 0);
    
    // Use cents for precise addition
    const spentCents = Math.round((typeof campaign.spent === 'number' ? campaign.spent : 0) * 100);
    acc[resultType].spent += spentCents / 100;
    
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
  // Debug currency formatting
  console.log(`Formatting currency value: ${value}`);
  
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
