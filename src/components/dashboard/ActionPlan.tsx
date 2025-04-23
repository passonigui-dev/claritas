
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Action } from "@/types";

interface ActionPlanProps {
  actions: Action[];
}

export function ActionPlan({ actions }: ActionPlanProps) {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [showIntegration, setShowIntegration] = useState(false);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const handleSelectAction = (id: string) => {
    setSelectedActions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleClickUpIntegration = () => {
    if (selectedActions.length === 0) {
      toast({
        title: "Selecione ações",
        description: "Selecione pelo menos uma ação para enviar ao ClickUp.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Ações enviadas",
      description: `${selectedActions.length} ações foram enviadas para o ClickUp.`,
    });
    
    setSelectedActions([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plano de Ação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <div 
              key={action.id}
              className="flex items-start gap-3 p-3 border rounded-md"
            >
              <Checkbox 
                id={`action-${action.id}`}
                checked={selectedActions.includes(action.id)}
                onCheckedChange={() => handleSelectAction(action.id)}
              />
              <div className="space-y-1">
                <label 
                  htmlFor={`action-${action.id}`}
                  className="font-medium text-sm cursor-pointer"
                >
                  {action.title}
                </label>
                <p className="text-xs text-muted-foreground">{action.description}</p>
                <div className="flex gap-2 items-center">
                  <div className={`px-2 py-0.5 text-xs rounded-full ${
                    action.priority === "high" 
                      ? "bg-red-100 text-red-700" 
                      : action.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }`}>
                    {action.priority === "high" ? "Alta" : action.priority === "medium" ? "Média" : "Baixa"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Estimativa: {action.timeEstimate}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3">
        {showIntegration ? (
          <div className="space-y-3 w-full">
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Cole a URL do webhook do ClickUp"
              className="w-full p-2 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button 
              onClick={handleClickUpIntegration}
              disabled={!webhookUrl || selectedActions.length === 0}
              className="w-full"
            >
              Enviar para o ClickUp
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setShowIntegration(true)}
            className="w-full"
          >
            Integrar com ClickUp
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
