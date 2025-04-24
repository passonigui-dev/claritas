
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { googleSheetsService } from '@/services/googleSheetsService';
import { Campaign } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useGoogleSheets() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Inicializa o serviço do Google Sheets quando o componente monta
  useEffect(() => {
    const initializeGoogleApi = async () => {
      try {
        await googleSheetsService.initialize();
      } catch (error) {
        console.error('Falha ao inicializar Google API:', error);
        toast({
          title: "Erro na integração com Google Sheets",
          description: "Não foi possível inicializar a API do Google.",
          variant: "destructive",
        });
      }
    };

    initializeGoogleApi();
  }, []);

  // Função para autenticar o usuário
  const authenticate = async () => {
    try {
      await googleSheetsService.authenticate();
      setIsAuthenticated(true);
      // Refetch data after successful authentication
      return true;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast({
        title: "Falha na autenticação",
        description: "Não foi possível autenticar com o Google. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Consulta React Query para buscar e atualizar dados da planilha
  const { 
    data: campaigns, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['sheetData'],
    queryFn: googleSheetsService.fetchSheetData.bind(googleSheetsService),
    enabled: isAuthenticated, // Só executa a query quando autenticado
    refetchInterval: 5 * 60 * 1000, // Recarregar a cada 5 minutos
    staleTime: 5 * 60 * 1000, // Considerar dados "frescos" por 5 minutos
    meta: {
      onError: (error: any) => {
        console.error('Erro ao buscar dados da planilha:', error);
        toast({
          title: "Falha ao carregar dados",
          description: "Ocorreu um erro ao buscar os dados da planilha.",
          variant: "destructive",
        });
      }
    }
  });

  // Salva dados no localStorage para persistência entre sessões
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
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
