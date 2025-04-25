
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SheetUrlFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function SheetUrlForm({ onSubmit, isLoading, error }: SheetUrlFormProps) {
  const [sheetUrl, setSheetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(sheetUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao importar planilha</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
  );
}
