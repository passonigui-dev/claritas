
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Campaign } from "@/types";

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Campanhas</CardTitle>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar campanhas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredCampaigns.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Nenhuma campanha encontrada.
          </p>
        ) : (
          <div className="space-y-2">
            {filteredCampaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-accent"
              >
                <div>
                  <h4 className="font-medium">{campaign.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs text-muted-foreground">
                      {campaign.platform === "google" ? "Google Ads" : "Meta Ads"}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.status === "active" ? "Ativa" : "Pausada"}
                    </div>
                  </div>
                </div>
                <Link to={`/campaign/${campaign.id}`}>
                  <Button variant="outline" size="sm">Ver detalhes</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
