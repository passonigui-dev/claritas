import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Campaign } from '@/types';
import { toast } from '@/hooks/use-toast';
import { processSheetData, RawSheetData } from '@/utils/sheetProcessing';
import { fetchSheetData } from '@/services/supabaseService';

const MOCK_SHEET_DATA: RawSheetData[] = [
  {
    plataforma: "Google Ads",
    "nome da campanha": "Conversão - Produtos Premium",
    status: "Ativo",
    "valor usado (brl)": 2750.45,
    impressoes: 125000,
    alcance: 95000,
    "cliques no link": 7800,
    resultados: 342,
    "data inicial": "01/01/2024",
    "data final": "31/01/2024",
    "link da campanha": "https://exemplo.com/campanha1"
  },
  {
    plataforma: "Meta Ads",
    "nome da campanha": "Remarketing - Carrinhos Abandonados",
    status: "Ativo",
    "valor usado (brl)": 1850.30,
    impressoes: 95000,
    alcance: 72000,
    "cliques no link": 5200,
    resultados: 286,
    "data inicial": "15/01/2024",
    "data final": "14/02/2024",
    "link da campanha": "https://exemplo.com/campanha2"
  }
];

export function useGoogleSheets() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [useMockData, setUseMockData] = useState(true);
  
  const { 
    data: campaigns,
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['sheetData'],
    queryFn: async () => {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return processSheetData(MOCK_SHEET_DATA);
      } else {
        try {
          const data = await fetchSheetData();
          return data;
        } catch (error) {
          console.error('Error fetching Google Sheets data:', error);
          setUseMockData(true);
          return processSheetData(MOCK_SHEET_DATA);
        }
      }
    },
    refetchInterval: 5 * 60 * 1000,
  });

  // Simulated authentication function
  const authenticate = async () => {
    try {
      // In real implementation, this would integrate with Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
      setUseMockData(false);
      
      toast({
        title: "Conectado com sucesso",
        description: "Conexão com Google Sheets estabelecida via Supabase",
      });
      
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Erro na autenticação",
        description: "Não foi possível conectar com Google Sheets",
        variant: "destructive",
      });
      return false;
    }
  };

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

  return {
    campaigns,
    isLoading,
    isError,
    error,
    isAuthenticated,
    authenticate,
    refetch,
    useMockData
  };
}
