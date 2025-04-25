
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Campaign, RawCampaignData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { processSheetData } from '@/utils/sheetProcessing';
import { supabase } from '@/integrations/supabase/client';

export function useGoogleSheets() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [rawData, setRawData] = useState<RawCampaignData[]>([]);
  
  const { 
    data: campaignData,
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['sheetData'],
    queryFn: async () => {
      try {
        console.log('Fetching Google Sheets data...');
        const { data, error } = await supabase.functions.invoke('fetch-google-sheets', {
          body: { action: 'fetch' }
        });

        if (error) {
          console.error('Error from edge function:', error);
          setUseMockData(true);
          throw error;
        }

        if (!data || !data.rows || !Array.isArray(data.rows)) {
          console.error('Invalid data format from edge function:', data);
          setUseMockData(true);
          throw new Error('Invalid data format received');
        }

        console.log('Received data from Google Sheets:', data.rows.length, 'rows');
        
        const processedData = processSheetData(data.rows);
        console.log('Processed campaign data:', processedData);
        
        // Store raw data for future AI processing
        setRawData(processedData.rawData);
        localStorage.setItem('campaignRawData', JSON.stringify(processedData.rawData));
        
        setUseMockData(false);
        return processedData.campaigns;
      } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
        setUseMockData(true);
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 1,
  });

  // Save data to localStorage for persistence
  useEffect(() => {
    if (campaignData && Array.isArray(campaignData) && campaignData.length > 0) {
      localStorage.setItem('campaignData', JSON.stringify(campaignData));
      toast({
        title: "Dados atualizados",
        description: "Dashboard atualizado com os dados mais recentes da planilha.",
      });
    }
  }, [campaignData]);

  const authenticate = async () => {
    setIsAuthenticated(true);
    try {
      await refetch();
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  };

  return {
    campaigns: campaignData,
    rawData,
    isLoading,
    isError,
    error,
    isAuthenticated,
    authenticate,
    refetch,
    useMockData
  };
}
