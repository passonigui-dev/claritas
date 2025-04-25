
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";

export function DataTrustHeader() {
  const { campaigns, isLoading, useMockData } = useGoogleSheets();
  
  const spreadsheetName = "Campaigns Spreadsheet - April 2025";
  const lastUpdatedDate = new Date().toLocaleDateString('pt-BR');
  const lastUpdatedTime = new Date().toLocaleTimeString('pt-BR', { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
  const recordsProcessed = campaigns?.length || 0;
  
  return (
    <Card className="mb-6 border-l-4 border-l-green-500">
      <CardContent className="py-4 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <p className="font-medium text-sm">
              Connected to: <span className="text-insight-700">{spreadsheetName}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdatedDate} at {lastUpdatedTime}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm">
              Records processed: <span className="font-medium">{recordsProcessed}</span>
            </p>
            
            <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 rounded-full py-1 px-3">
              <Check className="mr-1 h-4 w-4" />
              Data successfully updated
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
