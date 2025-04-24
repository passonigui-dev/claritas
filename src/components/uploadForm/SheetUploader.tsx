
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

export function SheetUploader() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sheetUrl, setSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // Process the sheet data - skip header row if exists
      const processedData = processSheetData(data.rows.slice(1));
      
      // Store the processed data in localStorage
      localStorage.setItem('campaignData', JSON.stringify(processedData));
      
      toast({
        title: "Planilha importada com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro completo:", error);
      
      let errorMessage = "Ocorreu um erro ao processar os dados. Tente novamente.";
      if (error.message && typeof error.message === 'string') {
        // Verificar se é um erro específico sobre falta de configuração
        if (error.message.includes("Missing required configuration")) {
          errorMessage = "Erro de configuração no servidor. Verifique se todas as chaves de API necessárias foram configuradas.";
        } else if (error.message.includes("API key not valid")) {
          errorMessage = "Chave de API do Google inválida. Por favor, verifique a configuração.";
        }
      }
      
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
