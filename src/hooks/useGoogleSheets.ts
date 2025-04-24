
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Campaign } from '@/types';
import { toast } from '@/hooks/use-toast';
import { processSheetData } from '@/utils/sheetProcessing';
import { supabase } from '@/integrations/supabase/client';

export function useGoogleSheets() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { 
    data: campaigns,
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['sheetData'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-google-sheets', {
          body: { action: 'fetch' }
        });

        if (error) throw error;

        const processedData = processSheetData(data.rows.slice(1)); // Skip header row
        return processedData;
      } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Save data to localStorage for persistence
  useEffect(() => {
    if (campaigns && Array.isArray(campaigns) && campaigns.length > 0) {
      localStorage.setItem('campaignData', JSON.stringify(campaigns));
      toast({
        title: "Dados atualizados",
        description: "Dashboard atualizado com os dados mais recentes da planilha.",
      });
    }
  }, [campaigns]);

  // Simulated authentication function - in this case, we're always authenticated
  // since we're using the Edge Function with the API key
  const authenticate = async () => {
    setIsAuthenticated(true);
    await refetch();
    return true;
  };

  return {
    campaigns,
    isLoading,
    isError,
    error,
    isAuthenticated,
    authenticate,
    refetch
  };
}
