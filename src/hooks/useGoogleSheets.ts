
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Campaign } from '@/types';
import { toast } from '@/hooks/use-toast';

// Dados mockados baseados na planilha real
const MOCK_SHEET_DATA = [
  {
    plataforma: "Google Ads",
    "nome da campanha": "Conversão - Produtos Premium",
    status: "Ativo",
    "valor usado (brl)": 2750.45,
    impressoes: 125000,
    alcance: 95000,
    "cliques no link": 7800,
    resultados: 342,
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
  },
  {
    plataforma: "Google Ads",
    "nome da campanha": "Marca - Awareness",
    status: "Ativo",
    "valor usado (brl)": 3850.90,
    impressoes: 250000,
    alcance: 180000,
    "cliques no link": 9800,
    resultados: 187,
  }
];

export function useGoogleSheets() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Query para simular busca de dados
  const { 
    data: campaigns, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['sheetData'],
    queryFn: async () => {
      // Simulando delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      return MOCK_SHEET_DATA;
    },
    refetchInterval: 5 * 60 * 1000, // Recarregar a cada 5 minutos
  });

  // Função simulada de autenticação
  const authenticate = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
    toast({
      title: "Conectado com sucesso",
      description: "Simulação de conexão com Google Sheets ativada",
    });
    return true;
  };

  // Salva dados no localStorage para persistência
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
    campaigns: campaigns as Campaign[] | undefined,
    isLoading,
    isError,
    error,
    isAuthenticated,
    authenticate,
    refetch,
  };
}
