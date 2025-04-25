
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SheetUrlForm } from "./SheetUrlForm";
import { useSheetData } from "@/hooks/useSheetData";

export function SheetUploader() {
  const { isLoading, errorMessage, handleSheetSubmit } = useSheetData();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Importar dados de campanhas</CardTitle>
        <CardDescription>
          Cole o link da sua planilha do Google Sheets para análise.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SheetUrlForm 
          onSubmit={handleSheetSubmit}
          isLoading={isLoading}
          error={errorMessage}
        />
      </CardContent>
    </Card>
  );
}
