
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "lucide-react";
import { processSheetData } from "@/utils/sheetProcessing";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function SheetUploader() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sheetUrl, setSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // Extract the spreadsheet ID from the URL
      const spreadsheetId = extractSpreadsheetId(sheetUrl);
      
      if (!spreadsheetId) {
        throw new Error("Não foi possível extrair o ID da planilha da URL fornecida.");
      }
      
      console.log("Chamando Edge Function com spreadsheetId:", spreadsheetId);
      
      // Call the Supabase Edge Function to fetch the Google Sheets data
      const { data, error } = await supabase.functions.invoke('fetch-google-sheets', {
        body: { 
          action: 'fetch',
          spreadsheetId: spreadsheetId 
        }
      });
      
      if (error) {
        console.error("Erro ao chamar a Edge Function:", error);
        throw error;
      }
      
      if (!data || !data.rows || !Array.isArray(data.rows)) {
        console.error("Formato de dados inválido:", data);
        throw new Error("Formato de dados inválido recebido da API.");
      }
      
      console.log("Dados recebidos com sucesso:", data.rows.length, "linhas");
      console.log("Exemplo das primeiras linhas:", data.rows.slice(0, 2));
      
      // Check if we have any data
      if (data.rows.length === 0) {
        throw new Error("A planilha está vazia. Verifique se há dados na planilha.");
      }
      
      try {
        // Process the sheet data
        const processedData = processSheetData(data.rows);
        
        if (processedData.length === 0) {
          throw new Error("Não foi possível processar os dados da planilha. Verifique se há pelo menos uma campanha válida.");
        }
        
        // Store the processed data in localStorage
        localStorage.setItem('campaignData', JSON.stringify(processedData));
        
        // Store raw data for AI processing
        try {
          // Determinamos se a primeira linha são os cabeçalhos ou já são dados
          const firstRowIsData = data.rows[0][0] && (
            data.rows[0][0].toString().match(/^\d{4}-\d{2}-\d{2}$/) || 
            data.rows[0][0].toString().match(/^\d{2}\/\d{2}\/\d{4}$/)
          );
          
          // Se a primeira linha parecer dados e não cabeçalhos, usamos cabeçalhos padrão
          const headers = firstRowIsData ? 
            ["dia", "objetivo", "plataforma", "nome_campanha", "nome_conjunto", 
             "nome_anuncio", "orcamento_campanha", "tipo_orcamento_campanha", 
             "orcamento_conjunto", "tipo_orcamento_conjunto", "valor_usado_brl", 
             "impressoes", "alcance", "tipo_resultado", "resultados", "status", 
             "nivel", "cliques_link", "data_inicial", "data_final"] :
            data.rows[0].map((h: any) => h?.toString().toLowerCase().trim() || "");
          
          const dataStartIndex = firstRowIsData ? 0 : 1;
          
          const rawDataArray = data.rows.slice(dataStartIndex).map((row: any[]) => {
            const obj: Record<string, any> = {};
            headers.forEach((header: string, index: number) => {
              if (header && index < row.length) {
                obj[header] = row[index];
              }
            });
            return obj;
          });
          
          localStorage.setItem('campaignRawData', JSON.stringify(rawDataArray));
          console.log("Raw data stored for AI processing:", rawDataArray.length, "rows");
        } catch (e) {
          console.warn("Failed to store raw data, but continuing with processed data:", e);
        }
        
        toast({
          title: "Planilha importada com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        
        navigate("/dashboard");
      } catch (processError) {
        console.error("Erro ao processar os dados da planilha:", processError);
        throw new Error("Não foi possível processar os dados da planilha. Verifique o formato e os cabeçalhos.");
      }
    } catch (error: any) {
      console.error("Erro completo:", error);
      
      let errorMessage = "Ocorreu um erro ao processar os dados. Tente novamente.";
      if (error.message && typeof error.message === 'string') {
        // Verificar se é um erro específico sobre falta de configuração
        if (error.message.includes("Missing required configuration")) {
          errorMessage = "Erro de configuração no servidor. Verifique se todas as chaves de API necessárias foram configuradas.";
        } else if (error.message.includes("API key not valid")) {
          errorMessage = "Chave de API do Google inválida. Por favor, verifique a configuração.";
        } else if (error.message.includes("Unable to parse range")) {
          errorMessage = "Erro na configuração do intervalo da planilha. Verifique se o nome da aba está correto.";
        } else {
          // Use the specific error message if available
          errorMessage = error.message;
        }
      }
      
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
  
  const isValidGoogleSheetsUrl = (url: string): boolean => {
    // Basic validation for Google Sheets URL
    return url.includes("docs.google.com/spreadsheets");
  };
  
  const extractSpreadsheetId = (url: string): string | null => {
    // Extract spreadsheet ID from Google Sheets URL
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Importar dados de campanhas</CardTitle>
        <CardDescription>
          Cole o link da sua planilha do Google Sheets para análise.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao importar planilha</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheet-url">URL do Google Sheets</Label>
            <Input
              id="sheet-url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Importando..." : "Importar dados"}
          </Button>
          
          <div className="text-xs text-muted-foreground flex items-center gap-1 justify-center mt-4">
            <Link className="h-3 w-3" />
            <a 
              href="https://docs.google.com/spreadsheets/d/1UPGtJx3rYgq63Ew7-mFTLNHrGAX4sEOZ7YBttYsPPRU/copy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Baixar template da planilha
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
