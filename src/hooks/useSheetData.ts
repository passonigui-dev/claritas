
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { processSheetData } from "@/utils/sheetProcessing";
import { isValidGoogleSheetsUrl, extractSpreadsheetId } from "@/utils/urlValidation";

export function useSheetData() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSheetSubmit = async (sheetUrl: string) => {
    setErrorMessage(null);
    
    if (!isValidGoogleSheetsUrl(sheetUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do Google Sheets.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const spreadsheetId = extractSpreadsheetId(sheetUrl);
      
      if (!spreadsheetId) {
        throw new Error("Não foi possível extrair o ID da planilha da URL fornecida.");
      }
      
      const { data, error } = await supabase.functions.invoke('fetch-google-sheets', {
        body: { 
          action: 'fetch',
          spreadsheetId: spreadsheetId 
        }
      });
      
      if (error) throw error;
      
      if (!data || !data.rows || !Array.isArray(data.rows)) {
        throw new Error("Formato de dados inválido recebido da API.");
      }
      
      const processedData = processSheetData(data.rows);
      
      if (processedData.campaigns.length === 0) {
        throw new Error("Não foi possível processar os dados da planilha. Verifique se há pelo menos uma campanha válida.");
      }
      
      localStorage.setItem('campaignData', JSON.stringify(processedData.campaigns));
      localStorage.setItem('campaignRawData', JSON.stringify(processedData.rawData));
      
      toast({
        title: "Planilha importada com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro completo:", error);
      
      const errorMessage = error.message && typeof error.message === 'string'
        ? error.message
        : "Ocorreu um erro ao processar os dados. Tente novamente.";
        
      setErrorMessage(errorMessage);
      
      toast({
        title: "Erro ao importar planilha",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errorMessage,
    handleSheetSubmit
  };
}
