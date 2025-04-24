
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { RefreshCcw, Lock, CheckCircle } from "lucide-react";

export function GoogleSheetsConnect() {
  const { isAuthenticated, authenticate, refetch, isLoading, useMockData } = useGoogleSheets();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    try {
      const success = await authenticate();
      if (success) {
        await refetch();
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Integração com Google Sheets</CardTitle>
        <CardDescription>
          {isAuthenticated 
            ? "Conectado e sincronizando dados automaticamente" 
            : "Conecte-se para sincronizar dados em tempo real"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2 text-green-600 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span>{useMockData ? "Demo mode" : "Autenticado com sucesso"}</span>
              </div>
              <Button 
                onClick={handleRefresh} 
                variant="outline"
                disabled={isLoading}
                className="w-full"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                {isLoading ? "Atualizando..." : "Atualizar dados agora"}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleAuthenticate}
              disabled={isAuthenticating}
              className="w-full"
            >
              <Lock className="h-4 w-4 mr-2" />
              {isAuthenticating ? "Autenticando..." : "Conectar com Google Sheets"}
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Os dados são atualizados automaticamente a cada 5 minutos
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
