
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "lucide-react";
import { processSheetData } from "@/utils/sheetProcessing";
import { useNavigate } from "react-router-dom";

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
      // In a real implementation, this would fetch data from the Google Sheets API
      // For now, we'll simulate the API call
      const response = await fetch(`/api/sheets?url=${encodeURIComponent(sheetUrl)}`);
      const data = await response.json();
      
      // Process the sheet data
      const processedData = processSheetData(data);
      
      // Store the processed data in localStorage for demo purposes
      // In a real app, you might want to use a proper state management solution
      localStorage.setItem('campaignData', JSON.stringify(processedData));
      
      toast({
        title: "Planilha importada com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao importar planilha",
        description: "Ocorreu um erro ao processar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const isValidGoogleSheetsUrl = (url: string): boolean => {
    // Verificação básica para URL do Google Sheets - em produção seria mais completa
    return url.includes("docs.google.com/spreadsheets");
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
              href="https://docs.google.com/spreadsheets/d/1example-template/copy" 
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
