
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink } from "lucide-react";
import { Campaign } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CampaignListV2Props {
  campaigns: Campaign[];
}

export function CampaignListV2({ campaigns }: CampaignListV2Props) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlatformLabel = (platform: string) => {
    if (platform === "meta") return "Meta Ads";
    if (platform === "google") return "Google Ads";
    return platform;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Ativa</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">Pausada</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Campaigns</CardTitle>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredCampaigns.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No campaigns found.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredCampaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="flex items-center justify-between p-4 border rounded-md hover:bg-accent hover:shadow-sm transition-all"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{campaign.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <div className="text-xs text-muted-foreground">
                      {getPlatformLabel(campaign.platform)}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                    <div>
                      {getStatusBadge(campaign.status)}
                    </div>
                  </div>
                </div>
                <Link to={`/campaign/${campaign.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    View details
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
